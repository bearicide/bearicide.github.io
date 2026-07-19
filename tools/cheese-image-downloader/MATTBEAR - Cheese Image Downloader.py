import os,re,threading,queue,webbrowser
from pathlib import Path
from urllib.parse import urljoin,urlparse,unquote
from io import BytesIO
import tkinter as tk
from tkinter import ttk,filedialog,messagebox
import requests
from bs4 import BeautifulSoup
from PIL import Image

APP='MATTBEAR - Cheese Image Downloader'
DEFAULT='https://fenton.thecheeselady.net/our-products/cheese/'
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36'

def clean(s):
 s=unquote(s or '').strip();s=re.sub(r'[<>:"/\\|?*\x00-\x1F]','',s);return re.sub(r'\s+',' ',s).strip(' .')[:120] or 'cheese'
def ext(ct,u):
 ct=(ct or '').lower()
 if 'png' in ct:return '.png'
 if 'webp' in ct:return '.webp'
 if 'gif' in ct:return '.gif'
 return '.jpg'

class App(tk.Tk):
 def __init__(self):
  super().__init__();self.title(APP);self.geometry('980x680');self.minsize(850,580);self.configure(bg='#f3ead8');self.q=queue.Queue();self.stopflag=False;self.rows=[];self.make_ui();self.after(100,self.poll)
 def make_ui(self):
  s=ttk.Style(self);s.theme_use('clam');s.configure('TButton',font=('Segoe UI Semibold',10),padding=(14,9));s.configure('Treeview',rowheight=32,font=('Segoe UI',10));
  f=tk.Frame(self,bg='#f3ead8',padx=20,pady=18);f.pack(fill='both',expand=True)
  tk.Label(f,text='Cheese Image Downloader',bg='#f3ead8',fg='#342519',font=('Georgia',24,'bold')).pack(anchor='w')
  tk.Label(f,text='Scan the cheese catalog and save one clean picture per cheese.',bg='#f3ead8',fg='#715d4d',font=('Segoe UI',10)).pack(anchor='w',pady=(2,14))
  card=tk.Frame(f,bg='#fffaf0',padx=14,pady=14,highlightbackground='#d1bea0',highlightthickness=1);card.pack(fill='x')
  self.url=tk.StringVar(value=DEFAULT);self.folder=tk.StringVar(value=str(Path.home()/'Downloads'/'MATTBEAR - Cheese Lady Pictures'))
  tk.Label(card,text='Catalog URL',bg='#fffaf0',fg='#342519',font=('Georgia',12,'bold')).grid(row=0,column=0,sticky='w')
  ttk.Entry(card,textvariable=self.url,font=('Segoe UI',11)).grid(row=1,column=0,columnspan=3,sticky='ew',pady=(5,10))
  tk.Label(card,text='Save to',bg='#fffaf0',fg='#342519',font=('Georgia',12,'bold')).grid(row=2,column=0,sticky='w')
  ttk.Entry(card,textvariable=self.folder,font=('Segoe UI',11)).grid(row=3,column=0,sticky='ew',pady=(5,0));ttk.Button(card,text='Choose Folder',command=self.choose).grid(row=3,column=1,padx=8);ttk.Button(card,text='Open Site',command=lambda:webbrowser.open(self.url.get())).grid(row=3,column=2);card.columnconfigure(0,weight=1)
  a=tk.Frame(f,bg='#f3ead8');a.pack(fill='x',pady=14)
  self.scan=ttk.Button(a,text='1. Scan Cheese Pages',command=self.start_scan);self.scan.pack(side='left')
  self.down=ttk.Button(a,text='2. Download Pictures',command=self.start_download,state='disabled');self.down.pack(side='left',padx=8)
  self.open=ttk.Button(a,text='Open Folder',command=self.open_folder);self.open.pack(side='right')
  body=tk.Frame(f,bg='#f3ead8');body.pack(fill='both',expand=True)
  self.tree=ttk.Treeview(body,columns=('n','name','status'),show='headings');self.tree.heading('n',text='#');self.tree.heading('name',text='Cheese');self.tree.heading('status',text='Status');self.tree.column('n',width=45,anchor='center');self.tree.column('name',width=520);self.tree.column('status',width=160);self.tree.pack(side='left',fill='both',expand=True)
  sb=ttk.Scrollbar(body,command=self.tree.yview);sb.pack(side='right',fill='y');self.tree.configure(yscrollcommand=sb.set)
  self.prog=ttk.Progressbar(f);self.prog.pack(fill='x',pady=(12,4));self.msg=tk.Label(f,text='Ready.',bg='#f3ead8',fg='#715d4d',anchor='w');self.msg.pack(fill='x')
 def sess(self):
  s=requests.Session();s.headers.update({'User-Agent':UA,'Accept-Language':'en-US,en;q=.9'});return s
 def choose(self):
  d=filedialog.askdirectory(initialdir=self.folder.get());
  if d:self.folder.set(d)
 def open_folder(self):
  p=Path(self.folder.get());p.mkdir(parents=True,exist_ok=True);os.startfile(str(p))
 def busy(self,v):self.scan.config(state='disabled' if v else 'normal');self.down.config(state='disabled' if v or not self.rows else 'normal')
 def start_scan(self):
  self.rows=[];self.tree.delete(*self.tree.get_children());self.busy(True);threading.Thread(target=self.scan_worker,daemon=True).start()
 def scan_worker(self):
  try:
   s=self.sess();r=s.get(self.url.get().strip(),timeout=30);r.raise_for_status();soup=BeautifulSoup(r.text,'html.parser');host=urlparse(self.url.get()).netloc;found={}
   for a in soup.select('a[href]'):
    u=urljoin(self.url.get(),a.get('href',''));p=urlparse(u)
    if p.netloc!=host or '/cheese/' not in p.path or p.path.rstrip('/')=='/our-products/cheese':continue
    name=' '.join(a.stripped_strings).strip() or p.path.rstrip('/').split('/')[-1].replace('-',' ').title();found[u.split('#')[0]]=clean(name)
   self.rows=[{'name':n,'url':u} for u,n in sorted(found.items(),key=lambda x:x[1].lower())];self.q.put(('scanned',self.rows))
  except Exception as e:self.q.put(('error',str(e)))
 def best(self,soup,page):
  cand=[]
  for sel,attr,score in [('meta[property="og:image"]','content',100),('meta[name="twitter:image"]','content',95),('article img','src',80),('.entry-content img','src',75),('main img','src',60),('img','src',20)]:
   for n in soup.select(sel):
    raw=n.get(attr) or n.get('data-src') or n.get('data-lazy-src')
    if not raw:continue
    u=urljoin(page,raw);low=u.lower()
    if any(x in low for x in ['logo','icon','avatar','placeholder']):continue
    cand.append((score,u))
  return max(cand)[1] if cand else None
 def start_download(self):self.busy(True);threading.Thread(target=self.download_worker,daemon=True).start()
 def download_worker(self):
  out=Path(self.folder.get());out.mkdir(parents=True,exist_ok=True);s=self.sess();ok=bad=0
  for i,row in enumerate(self.rows,1):
   try:
    self.q.put(('progress',i-1,len(self.rows),i-1,'Finding image'))
    r=s.get(row['url'],timeout=30);r.raise_for_status();u=self.best(BeautifulSoup(r.text,'html.parser'),row['url'])
    if not u:raise RuntimeError('No image found')
    ir=s.get(u,timeout=45);ir.raise_for_status();Image.open(BytesIO(ir.content)).verify();name=f'{i:03d} - {clean(row["name"])}{ext(ir.headers.get("content-type"),u)}';(out/name).write_bytes(ir.content);ok+=1;self.q.put(('progress',i,len(self.rows),i-1,'Downloaded'))
   except Exception as e:bad+=1;self.q.put(('progress',i,len(self.rows),i-1,'Skipped'))
  self.q.put(('done',ok,bad,str(out)))
 def poll(self):
  try:
   while True:
    m=self.q.get_nowait();k=m[0]
    if k=='scanned':
     for i,r in enumerate(m[1],1):self.tree.insert('', 'end',values=(i,r['name'],'Ready'))
     self.msg.config(text=f'Found {len(m[1])} cheese pages.');self.busy(False)
    elif k=='progress':
     done,total,row,st=m[1:];self.prog['maximum']=max(total,1);self.prog['value']=done;items=self.tree.get_children();vals=list(self.tree.item(items[row],'values'));vals[2]=st;self.tree.item(items[row],values=vals);self.tree.see(items[row]);self.msg.config(text=f'{done} of {total}')
    elif k=='done':self.busy(False);self.msg.config(text=f'Finished: {m[1]} saved, {m[2]} skipped.');messagebox.showinfo(APP,f'Finished.\n\nSaved: {m[1]}\nSkipped: {m[2]}\n\n{m[3]}')
    elif k=='error':self.busy(False);self.msg.config(text='Could not finish.');messagebox.showerror(APP,m[1])
  except queue.Empty:pass
  self.after(100,self.poll)
if __name__=='__main__':App().mainloop()
