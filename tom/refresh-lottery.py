import json,urllib.request,datetime,pathlib
now=datetime.datetime.now(datetime.timezone.utc)
start=now-datetime.timedelta(days=8)
query='{ winningNumbersForDateRange(dateRange: { start: "'+start.isoformat()+'", end: "'+now.isoformat()+'" }) { drawDate gameTypeId drawSequence winningNumbers { drawNumbers megaball powerball } } }'
request=urllib.request.Request('https://www.michiganlottery.com/api',data=json.dumps([{'query':query}]).encode(),headers={'Content-Type':'application/json'})
with urllib.request.urlopen(request,timeout=45) as response: records=json.load(response)[0]['data']['winningNumbersForDateRange']
records.sort(key=lambda r:r['drawDate'],reverse=True)
specs=[(4,'Daily 3 · Midday',3,9,True,None,None),(5,'Daily 3 · Evening',3,9,True,None,None),(6,'Daily 4 · Midday',4,9,True,None,None),(7,'Daily 4 · Evening',4,9,True,None,None),(21,'Daily 5 · Midday',5,9,True,None,None),(22,'Daily 5 · Evening',5,9,True,None,None),(8,'Fantasy 5',5,39,False,None,None),(10,'Lotto 47',6,47,False,None,None),(3,'Powerball',5,69,False,'powerball','Powerball'),(1,'Mega Millions',5,70,False,'megaball','Mega Ball')]
games=[]
for ident,name,count,maximum,digits,special,label in specs:
 for record in records:
  n=record.get('winningNumbers',{}).get('drawNumbers',[])
  if record['gameTypeId']!=ident or record['drawSequence']!=1 or len(n)!=count:continue
  if not all(type(v) is int and (0 if digits else 1)<=v<=maximum for v in n):continue
  if datetime.datetime.fromisoformat(record['drawDate'].replace('Z','+00:00'))>now:continue
  extra=record['winningNumbers'].get(special) if special else None
  if special and (type(extra) is not int or not 1<=extra<=(26 if special=='powerball' else 24)):continue
  games.append({'name':name,'drawDate':record['drawDate'],'numbers':n,'special':str(label)+': '+str(extra) if special else None});break
if len(games)!=10:raise RuntimeError('Incomplete official results; retaining the last verified file')
path=pathlib.Path(__file__).with_name('lottery.json')
path.write_text(json.dumps({'checkedAt':now.isoformat(),'games':games},ensure_ascii=False,indent=2)+'\n')
print('Updated 10 games from Michigan Lottery')
