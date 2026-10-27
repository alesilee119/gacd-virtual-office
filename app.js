/* GACD Technology — pixel-art Virtual Office. Everything is drawn in code on a 384x340 canvas. */
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const Q=new URLSearchParams(location.search),FF=parseFloat(Q.get('ff'))||0;
if(FF)document.documentElement.classList.add('ff');
let seed=11;const rnd=FF?()=>((seed=seed*16807%2147483647)/2147483647):Math.random;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches&&!FF;
const W=384,H=340,P=68,Fy=r=>r*P+58;
const cv=$('#cv'),ctx=cv.getContext('2d');cv.width=W;cv.height=H;ctx.imageSmoothingEnabled=false;
const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)};
let clk=0;
/* ---------- colour helpers ---------- */
const hex=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]};
const toHex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>{const x=hex(a),y=hex(b);return toHex(x.map((v,i)=>v+(y[i]-v)*t))};
const dk=(c,f)=>toHex(hex(c).map(v=>v*f));
/* ---------- 3x5 pixel font ---------- */
const G={A:[2,5,7,5,5],B:[6,5,6,5,6],C:[3,4,4,4,3],D:[6,5,5,5,6],E:[7,4,6,4,7],F:[7,4,6,4,4],G:[3,4,5,5,3],H:[5,5,7,5,5],I:[7,2,2,2,7],J:[1,1,1,5,2],K:[5,5,6,5,5],L:[4,4,4,4,7],M:[5,7,7,5,5],N:[6,5,5,5,5],O:[2,5,5,5,2],P:[6,5,6,4,4],Q:[2,5,5,7,3],R:[6,5,6,5,5],S:[3,4,2,1,6],T:[7,2,2,2,2],U:[5,5,5,5,7],V:[5,5,5,5,2],W:[5,5,7,7,5],X:[5,5,2,5,5],Y:[5,5,2,2,2],Z:[7,1,2,4,7],
'0':[7,5,5,5,7],'1':[2,6,2,2,7],'2':[6,1,2,4,7],'3':[6,1,2,1,6],'4':[5,5,7,1,1],'5':[7,4,6,1,6],'6':[3,4,7,5,7],'7':[7,1,2,2,2],'8':[7,5,7,5,7],'9':[7,5,7,1,6],'.':[0,0,0,0,2],'-':[0,0,7,0,0],'·':[0,0,2,0,0],'!':[2,2,2,0,2],' ':[0,0,0,0,0],'+':[0,2,7,2,0],'?':[6,1,2,0,2]};
const tw=s=>s.length*4-1;
function txt(s,x,y,c,k){k=k||1;s=s.toUpperCase();for(const ch of s){const g=G[ch]||G[' '];for(let i=0;i<5;i++)for(let j=0;j<3;j++)if((g[i]>>(2-j))&1)R(x+j*k,y+i*k,k,k,c);x+=4*k}}
/* ---------- sprites ---------- */
function spr(rows,x,y,pal,flip,k){k=k||1;for(let j=0;j<rows.length;j++){const row=rows[j],n=row.length;for(let i=0;i<n;i++){const ch=row[flip?n-1-i:i];if(ch!=='.'){const c=pal[ch];if(c)R(x+i*k,y+j*k,k,k,c)}}}}
const HEAD_CTO=["...HHHH...","..HHHHHH..",".GHSSSSHG.",".GSESSESG.",".GGSSSSS..","...SSSS...","..BBBBBB..",".BBBBBBBB.",".SBBBBBBS.",".SBBBBBBS.","..BBBBBB.."];
const HEAD_CFO=["..HHHHHH..",".HHHHHHHH.",".HHSSSSHH.","..SESSES..","..SSSSSS..","...SSSS...","..BBTTBB..",".BBBTTBBB.",".SBBTTBBS.",".SBBBBBBS.","..BBBBBB.."];
const LEGS=[["..LL..LL..","..LL..LL..","..KK..KK.."],["...LLLL...","...LLLL...","...KKKK..."]];
const PAL={cto:{H:'#3a2418',S:'#f1c9a0',E:'#1a1a1a',B:'#2a3f8a',G:'#2a2a2a',L:'#3c3c55',K:'#20202a'},cfo:{H:'#1a1410',S:'#e8b88a',E:'#1a1a1a',B:'#2f7a4d',T:'#f2ead0',L:'#2a2a3a',K:'#15151c'}};
const CAT=["..P..P......","..PPPP....P.",".PPEPEP..P..","..PPPPPPPPP.","...PPPPPPPP.","...P.P..P.P."],CAT2=["..P..P......","..PPPP....P.",".PPEPEP..P..","..PPPPPPPPP.","...PPPPPPPP.","....P.P.P.P."];
const CATP={P:'#d98a3d',E:'#222'};
/* ---------- time of day ---------- */
const HQ=Q.get('hour');let hourNow=0;
function updHour(){const d=new Date();hourNow=HQ!==null&&HQ!==''?parseFloat(HQ):d.getHours()+d.getMinutes()/60}
const dayness=h=>h>=7&&h<=17?1:h>=5&&h<7?(h-5)/2:h>17&&h<=20.5?1-(h-17)/3.5:0;
function skyCols(h){const K=[[0,'#0a0e2c','#1b2152'],[5,'#1f2a5e','#c9708c'],[7,'#5fa8e6','#bfe3f7'],[17,'#5fa8e6','#bfe3f7'],[19,'#e5784c','#f7c27a'],[20.5,'#171c48','#352f66'],[24,'#0a0e2c','#1b2152']];
 for(let i=0;i<K.length-1;i++)if(h>=K[i][0]&&h<=K[i+1][0]){const t=(h-K[i][0])/(K[i+1][0]-K[i][0]);return[mix(K[i][1],K[i+1][1],t),mix(K[i][2],K[i+1][2],t)]}return[K[0][1],K[0][2]]}
const skyCache={};
function buildings(w,hh,sd){const k=w+'_'+sd;if(skyCache[k])return skyCache[k];let s=sd,rr=()=>((s=s*16807%2147483647)/2147483647),a=[],x=-2;while(x<w){const bw=10+(rr()*14|0),bh=Math.round(hh*(.25+rr()*.5));a.push({x,w:bw,h:bh,l:rr()});x+=bw+(rr()*3|0)}return skyCache[k]=a}
function sky(x,y,w,h,sd){const d=dayness(hourNow),[top,bot]=skyCols(hourNow);ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
 const bands=7;for(let i=0;i<bands;i++)R(x,y+Math.floor(h*i/bands),w,Math.ceil(h/bands)+1,mix(top,bot,i/(bands-1)));
 if(d<.6){for(let i=0;i<14;i++){const sx=x+((i*53+sd*7)%w),sy=y+((i*29+sd*3)%(h*.55|0));if(((clk*1.3+i)|0)%5)R(sx,sy,1,1,'#fff')}}
 const ph=(hourNow-6)/12.5;if(ph>=0&&ph<=1){const sx=x+ph*(w-10),sy=y+h*.55-Math.sin(ph*Math.PI)*h*.45;R(sx+2,sy,4,8,'#ffd84a');R(sx,sy+2,8,4,'#ffd84a');R(sx+1,sy+1,6,6,'#ffe98a')}
 else{const mh=(hourNow+(hourNow<12?24:0)-19)/11,mp=Math.max(0,Math.min(1,mh)),mx=x+mp*(w-10),my=y+h*.5-Math.sin(mp*Math.PI)*h*.4;R(mx+2,my,4,8,'#f2eec8');R(mx,my+2,8,4,'#f2eec8');R(mx+1,my+1,6,6,'#fffbe0');R(mx+3,my+3,2,2,'#d6d2a8')}
 if(d>.3){for(let i=0;i<2;i++){const cx=x+((clk*(2+i)+i*60+sd*9)%(w+30))-15,cy=y+4+i*9;const c=mix('#bcc4e0','#ffffff',d);R(cx+3,cy+2,10,3,c);R(cx+5,cy,5,3,c);R(cx,cy+3,16,2,c)}}
 const far=mix('#26306a','#8fb2d6',d),near=mix('#161c48','#6a8fb8',d);
 for(const b of buildings(w,h,sd)){const col=b.l>.5?far:near;R(x+b.x,y+h-b.h,b.w,b.h,col);R(x+b.x,y+h-b.h,b.w,1,dk(col,.85));
  for(let yy=y+h-b.h+3;yy<y+h-2;yy+=4)for(let xx=x+b.x+2;xx<x+b.x+b.w-2;xx+=4){const lit=((xx*7+yy*13)%5)<3;const c=d<.55&&lit?(((xx+yy)%3)?'#ffe27a':'#ffb35c'):mix(col,'#ffffff',.12);R(xx,yy,2,2,c)}}
 ctx.restore()}
/* ---------- rooms ---------- */
const STAIR={1:{xin:61,xout:10},2:{xin:323,xout:374},3:{xin:61,xout:10},4:{xin:323,xout:374}};
const RC=['#a9c9a4','#a8c8e8','#f0c0cf','#bfe2d4','#f4d3b8'],RN=['MEETING ROOM','TECH LAB','FINANCE','PANTRY','LOBBY · MAILROOM'];
let T=[];const TKEY='gacd_tasks';
function roomBase(r){const y=r*P,c=RC[r];R(0,y,W,48,c);R(0,y,W,3,dk(c,.82));R(0,y+34,W,14,dk(c,.94));R(0,y+34,W,1,dk(c,.82));R(0,y+48,W,2,dk(c,.62));
 R(0,y+50,W,14,'#c28d5d');for(const ly of[54,58,62])R(0,y+ly,W,1,'#b07a4c');for(let k=0;k<4;k++)for(let x=((k*37)%24);x<W;x+=24)R(x,y+50+k*4,1,4,'#b07a4c');R(0,y+50,W,1,'#d9a674');R(0,y+64,W,4,'#2b2340');R(0,y+64,W,1,'#4a3f66')}
function plant(x,y,s){R(x+2,y-8,8,8,'#a8532f');R(x+1,y-9,10,2,'#c46a3f');const g='#3f9b4f',g2='#2d7a3b';R(x+5,y-20,2,12,g2);R(x+1,y-16,5,3,g);R(x+7,y-18,5,3,g);R(x+2,y-12,4,3,g2);R(x+7,y-14,5,3,g2);R(x+4,y-23,4,4,g)}
function frame(x,y,w,h,inner){R(x-2,y-2,w+4,h+4,'#5a3d28');R(x,y,w,h,inner||'#fff')}
function deskBack(d){const y0=d.room*P,sx=d.cx-8;R(sx-12,y0+29,24,21,'#4a4a66');R(sx-12,y0+29,24,2,'#5d5d80');R(sx-12,y0+31,2,19,'#3c3c55')}
function deskFront(d,ag){const y0=d.room*P,cx=d.cx,x=cx-22;
 R(x,y0+45,44,10,'#9c6a3f');R(x+2,y0+47,18,7,'#8a5a33');R(x+24,y0+47,18,7,'#8a5a33');R(x+10,y0+50,2,1,'#e8c07a');R(x+32,y0+50,2,1,'#e8c07a');R(x,y0+55,3,1,'#6b4429');R(x+41,y0+55,3,1,'#6b4429');
 R(x-1,y0+42,46,3,'#dba96f');R(x-1,y0+44,46,1,'#b9824f');
 const mx=cx+3,my=y0+29;R(mx,my,14,11,'#2a2a2e');R(mx+6,my+11,2,2,'#555');R(mx+3,y0+41,8,1,'#555');
 let sc='#16231a';if(d.agent){const on=ag&&(ag.st==='sit'||RM);sc=on?(((clk*7|0)%11===0)?'#2f9d4f':'#43d36a'):'#1d3a28'}
 R(mx+1,my+1,12,9,sc);
 if(d.agent&&(!ag||ag.st==='sit')){const t=RM?0:(clk*4|0);ctxMon(d.agent,mx+2,my+2,t)}
 else if(!d.agent){R(mx+3,my+4,2,1,'#2c4636');R(mx+8,my+6,3,1,'#2c4636')}
 R(cx+19,y0+40,3,2,'#e5e5ee');R(cx-20,y0+39,3,3,'#d94f4f');R(cx-20,y0+38,3,1,'#ee7d7d');
 const pl=tw(d.label)*2+6,px=Math.round(cx-pl/2);R(px-1,y0+54,pl+2,13,'#1d1a30');R(px,y0+55,pl,11,'#fdfdfd');R(px,y0+65,pl,1,'#c9c9d2');txt(d.label,px+3,y0+56,'#2b2b3b',2)}
function ctxMon(k,x,y,t){const c='#b6ffc8';if(k==='cto'){for(let i=0;i<4;i++){const l=2+((t*3+i*5+(i*i))%8);R(x+(i%2?2:0),y+i*2,Math.min(l,8),1,c)}}else{for(let i=0;i<4;i++){const hh=2+((t+i*3+i*i)%5);R(x+i*3,y+7-hh,2,hh,i%2?'#ffe27a':c)}}}
const DESKS=[{room:1,cx:100,label:'CTO ALEX',agent:'cto'},{room:1,cx:180,label:'OPEN'},{room:1,cx:260,label:'OPEN'},{room:2,cx:100,label:'CFO ALEX',agent:'cfo'},{room:2,cx:180,label:'OPEN'},{room:2,cx:260,label:'OPEN'}];
function drawMeeting(){const y=0;roomBase(0);
 ctx.save();ctx.translate(24,0);// awards wall (no text)
 R(78,y+8,52,30,'#7a5636');R(80,y+10,48,26,'#8a6644');R(80,y+22,48,2,'#5a3d28');
 for(const [tx,ty,s] of [[86,y+14,0],[100,y+14,1],[114,y+14,0]]){R(tx,ty+2,6,5,'#f5c431');R(tx+2,ty+7,2,2,'#e0a820');R(tx+1,ty+9,4,1,'#b07a20');R(tx-1,ty+3,1,2,'#f5c431');R(tx+6,ty+3,1,2,'#f5c431')}
 for(const tx of[86,98,110,120]){R(tx,y+27,6,7,['#d94f4f','#4f7fd9','#e8b830','#4fb87f'][(tx/4|0)%4]);R(tx+1,y+28,4,4,'#fff3');R(tx+2,y+34,2,1,'#ffffff55')}
 ctx.restore();
 // window
 R(318,y+8,40,28,'#5a3d28');sky(320,y+10,36,24,3);R(337,y+10,2,24,'#5a3d28');R(320,y+21,36,2,'#5a3d28');
 // table + chairs
 for(const cx of[142,186,230,262]){R(cx,y+32,16,14,'#7a5a9c');R(cx,y+32,16,2,'#9374b8')}
 R(128,y+44,150,3,'#c58a52');R(128,y+47,150,1,'#8a5a33');R(136,y+48,142,5,'#a8703f');R(138,y+53,3,3,'#6b4429');R(266,y+53,3,3,'#6b4429');R(205,y+49,8,3,'#8a5a33');
 R(176,y+39,6,5,'#fff');R(177,y+37,4,3,'#a07040');R(240,y+41,8,3,'#4f7fd9');R(240,y+40,8,1,'#7fa6f0');
 plant(300,y+50,1);
 // whiteboard
 const bx=205,by=y+6;R(bx-2,by-2,96,34,'#8a929c');R(bx,by,92,30,'#fbfbfd');R(bx+30,by+10,1,19,'#c9d0dc');R(bx+61,by+10,1,19,'#c9d0dc');R(bx,by+9,92,1,'#c9d0dc');
 txt('TASKS',bx+3,by+2,'#2b4a9a');txt('TODO',bx+9,by+11,'#c0392b');txt('DOING',bx+36,by+11,'#d68910');txt('DONE',bx+69,by+11,'#1e8449');
 const cols={todo:[],doing:[],done:[]};T.forEach(t=>cols[t.s]&&cols[t.s].push(t));
 ['todo','doing','done'].forEach((k,ci)=>{const L=cols[k];L.slice(0,6).forEach((t,i)=>{const nx=bx+4+ci*31+(i%3)*9,ny=by+16+((i/3)|0)*7;R(nx,ny,8,6,t.a==='CTO Alex'?'#8fb8ff':'#8fe3ab');R(nx+1,ny+2,6,1,'#0003');R(nx+1,ny+4,4,1,'#0003')});if(L.length>6)txt('+'+(L.length-6),bx+4+ci*31+19,by+23,'#555')});
 R(bx+2,by+31,30,2,'#6e757e');R(bx+6,by+30,4,2,'#e33');R(bx+12,by+30,4,2,'#33e');
 hint(bx-4,by+14,'r')}
function hint(x,y,dir){const b=RM?0:(Math.sin(clk*5)>0?2:0),w=42,h=14,I='#1b1b2f';let bx,by;
 if(dir==='r'){bx=x-w-b;by=y-7;R(x-b,y-4,2,8,I);R(x+2-b,y-2,2,4,I);R(x+4-b,y-1,2,2,I)}
 else if(dir==='u'){bx=x-21;by=y+6+b;R(x-4,y+4+b,8,2,I);R(x-2,y+2+b,4,2,I);R(x-1,y+b,2,2,I)}
 else{bx=x-21;by=y-14+b;R(x-4,y-2+b,8,2,I);R(x-2,y+b,4,2,I);R(x-1,y+2+b,2,2,I)}
 R(bx,by,w,h,I);R(bx+1,by+1,w-2,h-2,'#2d2850');txt('CLICK',bx+2,by+2,'#ffcc33',2)}
function drawTech(){const y=P;roomBase(1);
 frame(130,y+8,40,26,'#0e2a1a');for(let i=0;i<5;i++)R(133+(i%2)*3,y+11+i*4,6+((i*5)%11),1,'#6cff8a');
 R(203,y+8,14,14,'#fff8e0');R(202,y+7,16,1,'#5a3d28');R(202,y+22,16,1,'#5a3d28');R(202,y+7,1,16,'#5a3d28');R(217,y+7,1,16,'#5a3d28');R(210,y+10,2,6,'#333');R(210,y+15,4,2,'#333');
 R(238,y+8,30,3,'#d9a674');for(let i=0;i<5;i++)R(240+i*5,y+3,3,5,['#d94f4f','#4f7fd9','#e8b830','#4fb87f','#9374b8'][i]);
 // rack
 R(286,y+12,22,38,'#2d2f3c');R(286,y+12,22,2,'#464a5e');for(let i=0;i<6;i++){R(288,y+16+i*6,18,4,'#1c1d27');const on=RM?i%2:(((clk*2+i*1.7)|0)%3);R(290,y+17+i*6,2,2,on?'#46e06a':'#2a5a38');R(294,y+17+i*6,2,2,((clk*3+i)|0)%4===0?'#ffb347':'#6a4a20');R(298,y+17+i*6,6,1,'#3a3d50')}
 plant(312,y+54,1);
 DESKS.filter(d=>d.room===1).forEach(deskBack);DESKS.length}
function drawFinance(){const y=2*P;roomBase(2);
 ctx.save();ctx.translate(0,6);frame(26,y+8,40,28,'#fff');for(let i=0;i<4;i++)R(28,y+14+i*5,36,1,'#e3e3ea');for(let i=0;i<4;i++)R(34+i*8,y+8,1,28,'#e3e3ea');
 const pts=[[0,22],[6,19],[12,21],[18,14],[24,16],[30,9],[36,5]];for(let i=0;i<pts.length-1;i++){const[a,b]=[pts[i],pts[i+1]];for(let s=0;s<6;s++)R(28+a[0]+s,y+8+a[1]+(b[1]-a[1])*s/6,2,2,'#1ea54a')}R(62,y+11,3,3,'#e8b830');ctx.restore();
 frame(70,y+8,22,13,'#fff');R(73,y+16,3,4,'#4f7fd9');R(78,y+13,3,7,'#4f7fd9');R(83,y+11,3,9,'#4f7fd9');
 R(118,y+6,134,9,'#0b0b12');R(118,y+6,134,1,'#3a3a4a');for(let i=0;i<9;i++){const sx=Math.round(((i*16)-(clk*12))%144);const xx=118+((sx+144)%144);if(xx<248){const up=i%3!==0;R(xx+1,y+8,6,1,up?'#46e06a':'#ff5c5c');R(xx+3,y+10+(up?0:1),2,2,up?'#46e06a':'#ff5c5c')}}
 plant(290,y+54,1);
 DESKS.filter(d=>d.room===2).forEach(deskBack)}
function drawPantry(){const y=3*P;roomBase(3);
 // wine shelf
 R(114,y+22,74,2,'#7a5636');R(114,y+24,74,1,'#4a3220');const bc=['#2d5a3a','#6a2a4a','#2d5a3a','#8a3a2a','#3a4a7a','#6a2a4a','#2d5a3a','#8a3a2a'];for(let i=0;i<8;i++){const bx=117+i*9;R(bx,y+13,4,9,bc[i]);R(bx+1,y+9,2,5,bc[i]);R(bx+1,y+8,2,1,'#d9c9a0');R(bx+1,y+16,2,3,'#ffffff55')}
 R(112,y+26,2,3,'#fff6');
 // counter
 R(72,y+42,118,3,'#dcdce6');R(72,y+45,118,9,'#8f6a49');R(72,y+45,118,1,'#6b4a30');R(94,y+46,2,7,'#6b4a30');R(150,y+46,2,7,'#6b4a30');R(172,y+49,2,1,'#e8c07a');
 // coffee machine
 R(80,y+26,16,16,'#8a2f2f');R(80,y+26,16,3,'#a83d3d');R(83,y+31,10,5,'#1b1b2f');R(85,y+36,6,2,'#555');R(84,y+38,8,4,'#e8e8f0');R(86,y+38,4,3,'#7a4a2a');R(94,y+31,2,2,(RM||Math.sin(clk*4)>0)?'#46e06a':'#2a5a38');
 for(let i=0;i<3;i++){const t=(clk*1.2+i*.34)%1;if(!RM||i===0)R(86+(i%2)*3+Math.round(Math.sin(clk*3+i)*1),y+36-Math.round(t*9),1,2,'#ffffffaa')}
 R(104,y+34,20,8,'#c9c9d4');R(106,y+36,11,4,'#222');R(119,y+36,3,2,'#8a8a99');
 // fridge
 R(196,y+14,22,36,'#f1f2f8');R(196,y+14,22,2,'#fff');R(196,y+28,22,1,'#aab');R(214,y+19,2,6,'#8a8a99');R(214,y+31,2,10,'#8a8a99');R(198,y+50,18,2,'#00000030');R(200,y+18,6,5,'#ffcc33');R(200,y+18,6,1,'#fff6');
 // fish tank
 const tx=234,ty=y+16,tw_=72,th=28;R(tx-3,ty-3,tw_+6,th+6,'#3a2c20');R(tx,ty,tw_,th,'#3f8fc4');R(tx,ty,tw_,4,'#7cc3ea');R(tx,ty+th-5,tw_,5,'#e3c98f');
 R(tx-3,ty+th+3,tw_+6,14,'#8f6a49');R(tx-3,ty+th+3,tw_+6,1,'#6b4a30');
 for(const px of[tx+8,tx+34,tx+58]){R(px,ty+th-12,1,8,'#2f8f4a');R(px+1,ty+th-9,1,5,'#3fb360');R(px-1,ty+th-7,1,3,'#3fb360')}
 for(let i=0;i<4;i++){const by=((clk*7+i*9)%(th-6));R(tx+14+i*14+(i%2),ty+th-6-by,1,1,'#ffffffbb')}
 for(let k=0;k<2;k++){const f=(Math.sin(clk*.5+k*2.2)+1)/2,cxp=tx+8+f*(tw_-22),dir=Math.cos(clk*.5+k*2.2)>0,w2=((clk*3+k)|0)%2;
  const crab=["R.....R",".R.R.R.",".RRRRR.",w2?"R.R.R.R":".R.R.R."];spr(crab,Math.round(cxp),ty+th-9,{R:k?'#e2452f':'#c8372d'},dir);R(Math.round(cxp)+(dir?5:1),ty+th-8,1,1,'#fff')}
 {const f=(Math.sin(clk*.35)+1)/2,fx=tx+4+f*(tw_-14),d=Math.cos(clk*.35)>0;spr([".OOO..","OOEOOT",".OOO.T"],Math.round(fx),ty+9,{O:'#ff9a3c',E:'#222',T:'#ffcf7a'},d)}
 // LIVE sign
 R(256,y+3,30,11,'#7a1010');R(257,y+4,28,9,'#d92b2b');txt('LIVE',259,y+6,'#fff');const on=RM||((clk*1.6|0)%2);R(279,y+7,3,3,on?'#fff':'#d92b2b');R(264,y+14,2,3,'#555');R(276,y+14,2,3,'#555');
 plant(322,y+54,1)}
function drawLobby(){const y=4*P;roomBase(4);
 // door
 R(2,y+16,24,34,'#5a3d28');R(4,y+18,20,32,'#a8703f');R(6,y+20,16,11,'#8a5a33');R(6,y+34,16,13,'#8a5a33');R(20,y+34,2,3,'#ffcc33');
 // logo sign placeholder
 R(74,y+18,56,28,'#2b2340');R(76,y+20,52,24,'#f4efe2');for(let i=0;i<52;i+=4){R(76+i,y+20,2,1,'#8a83b0');R(76+i,y+43,2,1,'#8a83b0')}for(let j=0;j<24;j+=4){R(76,y+20+j,1,2,'#8a83b0');R(127,y+20+j,1,2,'#8a83b0')}txt('LOGO',83,y+22,'#2b2340',2);txt('HERE',83,y+33,'#8a83b0',2);
 // big window
 R(142,y+4,124,42,'#5a3d28');sky(145,y+7,118,36,5);R(203,y+7,2,36,'#5a3d28');R(145,y+24,118,2,'#5a3d28');R(140,y+46,128,3,'#7a5636');
 // mailbox on table
 const mx=36,my=y+26;R(mx-8,y+44,34,3,'#c58a52');R(mx-6,y+47,2,8,'#8a5a33');R(mx+18,y+47,2,8,'#8a5a33');
 R(mx,my+4,18,10,'#3b6fb6');R(mx+2,my+2,14,2,'#3b6fb6');R(mx+4,my,10,2,'#3b6fb6');R(mx+3,my+8,9,1,'#142a4a');R(mx,my+13,18,1,'#2a4f8a');R(mx+8,my+14,2,2,'#555');
 let reqs=0;try{reqs=JSON.parse(localStorage.getItem('gacd_requests')||'[]').length}catch(e){}
 R(mx+18,my+(reqs?0:5),2,9-(reqs?0:5)+(reqs?0:0),'#444');R(mx+19,my+(reqs?0:4),5,3,'#e33');if(reqs)R(mx+3,my+5,6,3,'#fff');
 hint(mx+9,y+48,'u');
 // rug + plant
 R(150,y+57,70,7,'#8a2f4a');R(151,y+58,68,5,'#a8405f');txt('WELCOME',164,y+58,'#f4efe2');
 plant(280,y+54,1);R(298,y+30,18,16,'#fff8e0');R(297,y+29,20,1,'#5a3d28');R(297,y+46,20,1,'#5a3d28');R(297,y+29,1,18,'#5a3d28');R(316,y+29,1,18,'#5a3d28');R(306,y+32,2,8,'#333');R(306,y+39,6,2,'#333')}
function drawStairs(){for(let r=1;r<=4;r++){const s=STAIR[r],y0=r*P,F=Fy(r),dir=s.xout>s.xin?1:-1;
  for(let i=0;i<18;i++){const x=dir>0?s.xin+i*3:s.xin-i*3-3,top=F-4*i;R(x,top,3,y0+64-top,'#6b4429');R(x,top,3,1,'#d6a064');R(x,top+1,3,1,'#a8703f')}
  const ex=dir>0?s.xout+2:s.xout-2;R(ex,F-68-8,2,8,'#3a2a1c')}}
function drawTabs(){for(let r=0;r<5;r++){const y=r*P,w=tw(RN[r])*2+8;R(0,y,w,14,'#1d1a30');R(w,y,1,14,'#4a4470');R(0,y+14,w+1,1,'#4a4470');txt(RN[r],4,y+2,'#f4efe2',2)}}
/* ---------- agents ---------- */
const SPOT={board:{room:0,x:250},coffee:{room:3,x:100},fridge:{room:3,x:207},fish:{room:3,x:270},mail:{room:4,x:48},view:{room:4,x:188}};
const SAY={cto:{desk:["Back to coding 💻","Merging a PR ✅","Hi! I'm CTO Alex 👋","Need tech help? Click me!"]},cfo:{desk:["Checking the numbers 📊","Balancing the budget 💰","Hello from Finance 💼","Click me for money stuff 💰"]},
 board:["Updating the task board 📋","New tasks up! 📝"],coffee:["Grabbing coffee ☕","Coffee break ☕"],mail:["Any new requests? 📬","Checking the mail ✉️"],fish:["Feeding the crabs 🦀"],fridge:["Snack time 🍎"],view:["Nice view! 🌆"]};
const pick=a=>a[rnd()*a.length|0];
function route(a,toRoom,tx){const pts=[];let r=a.room;while(r!==toRoom){const dir=toRoom>r?1:-1,hi=dir>0?r+1:r,st=STAIR[hi];
  if(dir>0){pts.push({x:st.xout,y:Fy(r)});pts.push({x:st.xin,y:Fy(hi),stair:1,room:hi})}else{pts.push({x:st.xin,y:Fy(hi)});pts.push({x:st.xout,y:Fy(hi-1),stair:1,room:hi-1})}r+=dir}
 pts.push({x:tx,y:Fy(toRoom),room:toRoom});return pts}
const SEATX={cto:92,cfo:92};
const AG={cto:{id:'cto',name:'CTO Alex',room:1,x:92,y:Fy(1),st:'sit',wait:5,plan:[],path:[],face:1,wt:0,sp:34,bt:4,msg:'Hi! I\'m CTO Alex 👋',head:HEAD_CTO,item:'#9aa3b5'},
 cfo:{id:'cfo',name:'CFO Alex',room:2,x:92,y:Fy(2),st:'sit',wait:9,plan:[],path:[],face:-1,wt:0,sp:33,bt:4,msg:'Checking the numbers 📊',head:HEAD_CFO,item:'#1b2a5a'}};
const PET={room:4,x:200,y:Fy(4),st:'idle',wait:2,path:[],face:1,wt:0,sp:16,bt:0,msg:''};
const meet={on:false,t:0,tm:FF?14:20,chat:false};
const MEETX={cto:150,cfo:270};
function say(a,m,d){a.msg=m;a.bt=d||3.6;a.fresh=1}
function seatTo(a){a.path=route(a,a.id==='cto'?1:2,SEATX[a.id]);a.st='walk'}
function sitDown(a){a.st='sit';a.x=SEATX[a.id];a.y=Fy(a.room);a.wait=7+rnd()*5;say(a,pick(SAY[a.id].desk))}
function genPlan(a,other){const keys=Object.keys(SPOT).filter(k=>!(other&&other.cur===k));const p=[];const n=rnd()<.4?2:1;for(let i=0;i<n;i++){let k;do k=pick(keys);while(p.length&&p[0].k===k);p.push({k,...SPOT[k],wait:3.5+rnd()*2.5,say:pick(SAY[k])})}p.push({home:1});return p}
function nextStep(a,o){if(!a.plan.length)a.plan=genPlan(a,o);const s=a.plan.shift();a.cur=s.k||'';a.step=s;if(s.home){seatTo(a)}else{a.path=route(a,s.room,s.x);a.st='walk'}}
function advance(a,dt){let s=a.sp*dt;while(a.path.length&&s>0){const t=a.path[0];if(!a.seg)a.seg={x0:a.x,y0:a.y,L:Math.hypot(t.x-a.x,t.y-a.y)||.001,d:0};if(t.x!==a.x)a.face=t.x>a.x?1:-1;
  const g=a.seg,rem=g.L-g.d;if(s>=rem){s-=rem;a.x=t.x;a.y=t.y;if(t.room!==undefined)a.room=t.room;a.path.shift();a.seg=null}
  else{g.d+=s;s=0;const p=g.d/g.L;a.x=g.x0+(t.x-g.x0)*p;if(t.stair){const n=Math.floor(Math.abs(a.x-g.x0)/3);a.y=g.y0+Math.sign(t.y-g.y0)*Math.min(n*4,68)}else a.y=g.y0+(t.y-g.y0)*p}}
 return !a.path.length}
function tickAgent(a,o,dt){if(a.paused)return;a.bt-=dt;
 if(a.st==='sit'){if(!meet.on){a.wait-=dt;if(a.wait<=0)nextStep(a,o)}}
 else if(a.st==='walk'){a.wt+=dt;if(advance(a,dt)){a.wt=0;const s=a.step;if(s&&s.home&&!meet.on)sitDown(a);else if(s&&s.meet){a.st='stand';a.ready=1;a.wait=999;a.face=a.id==='cto'?1:-1;say(a,'...',2)}else if(s&&s.home){sitDown(a)}else{a.st='stand';a.wait=s?s.wait:3;if(s&&s.say)say(a,s.say)}}}
 else if(a.st==='stand'){if(!meet.on||!a.ready){a.wait-=dt;if(a.wait<=0)nextStep(a,o)}}}
function startMeet(){const a=AG.cto,b=AG.cfo;if(a.paused||b.paused||[a,b].some(x=>x.seg&&x.path[0]&&x.path[0].stair)){meet.tm=1.5;return}
 meet.on=true;meet.chat=false;meet.t=0;for(const x of[a,b]){x.ready=0;x.plan=[{home:1}];x.step={meet:1};x.path=route(x,0,MEETX[x.id]);x.st='walk';x.seg=null;x.cur='meet'}}
const CHAT=[[0,'cto',"Hey CFO Alex! 👋"],[2.6,'cfo',"Hi CTO Alex! Got a minute? ☕"],[5.6,'cto',"Let's plan the next sprint 🚀"],[8.8,'cfo',"I'll check the budget for it 📊"]];
function tickMeet(dt){if(!meet.on){meet.tm-=dt;if(meet.tm<=0&&!AG.cto.paused&&!AG.cfo.paused)startMeet();return}
 const a=AG.cto,b=AG.cfo;if(!meet.chat){if(a.ready&&b.ready&&a.st==='stand'&&b.st==='stand'){meet.chat=true;meet.t=0;meet.i=0}return}
 if(a.paused||b.paused)return;meet.t+=dt;while(meet.i<CHAT.length&&meet.t>=CHAT[meet.i][0]){say(AG[CHAT[meet.i][1]],CHAT[meet.i][2],2.7);meet.i++}
 if(meet.t>12.5){meet.on=false;meet.chat=false;meet.tm=34+rnd()*8;for(const x of[a,b]){x.ready=0;x.wait=.3;x.plan=[{home:1}]}}}
function tickPet(dt){const p=PET;p.bt-=dt;if(p.path.length){p.wt+=dt;if(advance(p,dt)){p.st='idle';p.wait=2+rnd()*5}return}
 p.wait-=dt;if(p.wait<=0){const lo=70,hi=p.room===4?318:(p.room===0?372:318);if(rnd()<.14){const nr=Math.max(0,Math.min(4,p.room+(rnd()<.5?-1:1)));p.path=route(p,nr,lo+rnd()*(hi-lo))}else p.path=[{x:(p.room===4?14:lo)+rnd()*(hi-(p.room===4?14:lo)),y:Fy(p.room)}];p.st='walk'}}
function update(dt){clk+=dt;if(RM)return;tickMeet(dt);tickAgent(AG.cto,AG.cfo,dt);tickAgent(AG.cfo,AG.cto,dt);tickPet(dt)}
/* ---------- agent drawing ---------- */
function drawChar(a,seated){const pal=Object.assign({},PAL[a.id]);if(!RM&&(clk*.7%4)>3.82)pal.E=pal.S;
 if(seated){const y0=a.room*P,sx=a.x-10,ty=y0+22;spr(a.head,sx,ty,pal,false,2);
  const tp=RM?0:(clk*6|0)%2;R(sx+4+(tp?0:6),y0+41,4,2,pal.S);R(sx+12-(tp?0:6),y0+41,4,2,pal.S);return}
 const f=a.st==='walk'?((a.wt/.17)|0)%2:0,bob=a.st==='walk'&&f?1:0,x=Math.round(a.x)-10,y=Math.round(a.y)-28-bob*2,fl=a.face<0;
 R(x+2,Math.round(a.y)-1,16,2,'#0003');
 spr(a.head,x,y,pal,fl,2);spr(LEGS[f],x,y+22,pal,fl,2);
 const ix=fl?x-6:x+20;R(ix,y+16,7,6,a.item);R(ix,y+16,7,1,'#ffffff55');if(a.id==='cfo')R(ix+2,y+18,3,2,'#6cff8a');else R(ix+2,y+20,3,2,'#6fd3ff')}
function drawPet(){const p=PET,f=p.st==='walk'?((p.wt/.15)|0)%2:0;spr(f?CAT2:CAT,Math.round(p.x)-12,Math.round(p.y)-12,CATP,p.face<0,2);R(Math.round(p.x)-10,Math.round(p.y),20,1,'#0003');
 if(p.st==='idle'&&p.wait>2.5&&!RM&&((clk*1.5|0)%2))txt('Z',Math.round(p.x)+(p.face>0?-14:10),Math.round(p.y)-22,'#fff',2)}
function render(){ctx.clearRect(0,0,W,H);drawMeeting();drawTech();drawFinance();drawPantry();drawLobby();drawStairs();drawTabs();
 for(const d of DESKS){const ag=d.agent?AG[d.agent]:null;if(ag&&ag.st==='sit')drawChar(ag,true)}
 for(const d of DESKS)deskFront(d,d.agent?AG[d.agent]:null);
 for(const a of Object.values(AG))if(a.st!=='sit')drawChar(a,false);
 drawPet()}
/* ---------- bubbles / scale / input ---------- */
const bub={cto:mkB(),cfo:mkB(),pet:mkB()};function mkB(){const e=document.createElement('div');e.className='pb';$('#bubbles').appendChild(e);return e}
let SC=2;
function layout(){const phone=innerWidth<700;SC=phone?2:Math.max(2,Math.floor((innerWidth-48)/W));document.documentElement.style.setProperty('--s',SC);cv.style.width=W*SC+'px';cv.style.height=H*SC+'px';layout.done=1}
function head(a){return a.st==='sit'?{x:a.x,y:a.room*P+19}:{x:a.x,y:a.y-31}}
function showB(k,a,pos){const e=bub[k];if(a.bt>0&&a.msg&&!(a.paused&&false)){e.textContent=a.msg;if(a.fresh){e.classList.remove('on');void e.offsetWidth;a.fresh=0}e.classList.add('on');
  const w=e.offsetWidth/SC/1,minL=(a.st==='sit'?76:2),px=Math.max(w/2+minL,Math.min(W-w/2-2,pos.x)),tail=Math.max(-(w/2-4),Math.min(w/2-4,pos.x-px))*SC;e.style.setProperty('--tail',tail+'px');e.style.left=Math.round(px*SC)+'px';e.style.top=Math.round((pos.y-6)*SC)+'px';const tr='translate(-50%,-100%)';e.style.transform=tr;e.style.setProperty('--t',tr)}else e.classList.remove('on')}
function placeBubbles(){showB('cto',AG.cto,head(AG.cto));showB('cfo',AG.cfo,head(AG.cfo));showB('pet',PET,{x:PET.x,y:PET.y-15})}
function rects(){const a=[];for(const k of['cto','cfo']){const g=AG[k];a.push({k,x0:g.x-13,x1:g.x+13,y0:g.st==='sit'?g.room*P+20:g.y-30,y1:g.st==='sit'?g.room*P+56:g.y+3})}return a}
function hit(ev){const r=cv.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width*W,y=(ev.clientY-r.top)/r.height*H;
 for(const q of rects())if(x>=q.x0&&x<=q.x1&&y>=q.y0&&y<=q.y1)return{t:'agent',k:q.k};
 if(Math.abs(x-PET.x)<14&&Math.abs(y-PET.y+6)<10)return{t:'pet'};
 if(x>=203&&x<=299&&y>=4&&y<=38)return{t:'board'};if(x>=22&&x<=66&&y>=4*P+20&&y<=4*P+66)return{t:'mail'};return null}
cv.addEventListener('pointermove',e=>{const h=hit(e);cv.style.cursor=h?'pointer':'default'});
cv.addEventListener('click',e=>{e.stopPropagation();const h=hit(e);if(!h)return;if(h.t==='agent')show(h.k);else if(h.t==='board')open('tasks');else if(h.t==='mail')open('contact');else if(h.t==='pet')say(PET,pick(['Meow! 🐱','Purr… 🐾','Mrrp! 🐟']),2.5)});
/* ---------- cards & panels ---------- */
const INFO={cto:{n:'CTO Alex',t:'Chief Technology Officer · AI virtual staff',r:['Code & pull requests','Architecture decisions','Monitoring','Tech research']},cfo:{n:'CFO Alex',t:'Chief Financial Officer · AI virtual staff',r:['Budgets','Financial reporting','Cash flow','Financial planning']}};
const card=$('#card');let cur=null;
function avatar(k){const c=$('#av'),x=c.getContext('2d');x.clearRect(0,0,12,13);const rows=AG[k].head,pal=PAL[k];for(let j=0;j<rows.length;j++)for(let i=0;i<10;i++){const ch=rows[j][i];if(ch!=='.'&&pal[ch]){x.fillStyle=pal[ch];x.fillRect(i+1,j+1,1,1)}}}
function show(k){const a=INFO[k];cur=a.n;for(const g of Object.values(AG))g.paused=false;AG[k].paused=true;$('#c-name').textContent=a.n;$('#c-title').textContent=a.t;$('#c-list').innerHTML=a.r.map(x=>'<li>'+x+'</li>').join('');avatar(k);card.hidden=false;
 if(innerWidth>=700){const r=cv.getBoundingClientRect(),g=AG[k],px=r.left+g.x*SC,py=r.top+(g.st==='sit'?g.room*P+20:g.y-30)*SC;let l=px+14*SC,t=py;if(l+360>innerWidth)l=px-14*SC-340;card.style.left=Math.max(8,l)+'px';card.style.top=Math.max(8,Math.min(t,innerHeight-480))+'px'}}
function closeCard(){card.hidden=true;for(const g of Object.values(AG))g.paused=false}
function open(id){closeCard();$('#'+id).hidden=false;draw()}
document.addEventListener('click',e=>{if(!card.hidden&&!card.contains(e.target))closeCard()});
$$('[data-open]').forEach(b=>b.onclick=e=>{e.stopPropagation();open(b.dataset.open)});$$('[data-staff]').forEach(b=>b.onclick=e=>{e.stopPropagation();focusOn(b.dataset.staff);show(b.dataset.staff)});
function focusOn(k){const g=AG[k],st=$('#stage'),r=cv.getBoundingClientRect();if(innerWidth<700)st.scrollTo({left:Math.max(0,(g.x-97)*SC),behavior:FF?'auto':'smooth'});const yy=(g.st==='sit'?g.room*P:g.y-60)*SC+r.top+scrollY-120;scrollTo({top:Math.max(0,yy),behavior:FF?'auto':'smooth'})}
$$('[data-close]').forEach(b=>b.onclick=()=>{const o=b.closest('.overlay');if(o)o.hidden=true;else closeCard()});$$('.overlay').forEach(o=>o.onclick=e=>{if(e.target===o)o.hidden=true});
document.onkeydown=e=>{if(e.key==='Escape'){$$('.overlay').forEach(o=>o.hidden=true);closeCard()}};
$('#c-assign').onclick=e=>{e.stopPropagation();const n=cur;closeCard();$('#tasks').hidden=false;$('#ta').value=n;$('#tt').focus();renderTasks()};
/* ---------- tasks (localStorage) ---------- */
const S=['todo','doing','done'];T=JSON.parse(localStorage.getItem(TKEY)||'null')||[{id:1,t:'Review open pull requests',a:'CTO Alex',s:'todo'},{id:2,t:'Draft monthly budget',a:'CFO Alex',s:'doing'}];
const save=()=>localStorage.setItem(TKEY,JSON.stringify(T)),esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderTasks(){$$('.col').forEach(c=>{const l=c.querySelector('.list');l.innerHTML='';T.filter(x=>x.s===c.dataset.s).forEach(x=>{const i=S.indexOf(x.s),d=document.createElement('div');d.className='task';
 d.innerHTML=`<div>${esc(x.t)}</div><span class="who ${x.a==='CTO Alex'?'cto':'cfo'}">${x.a}</span><div>${i>0?'<button data-m="-1">◀</button>':''}${i<2?'<button data-m="1">▶</button>':''}<button data-del>✕</button></div>`;
 d.onclick=e=>{const b=e.target;if(b.dataset.m)x.s=S[i+ +b.dataset.m];else if('del' in b.dataset)T=T.filter(y=>y!==x);else return;save();renderTasks();draw()};l.appendChild(d)})})}
$('#tf').onsubmit=e=>{e.preventDefault();T.push({id:Date.now(),t:$('#tt').value.trim(),a:$('#ta').value,s:'todo'});$('#tt').value='';save();renderTasks();draw()};
$('#cf').onsubmit=e=>{e.preventDefault();const f=e.target,r=JSON.parse(localStorage.getItem('gacd_requests')||'[]');r.push({...Object.fromEntries(new FormData(f)),at:new Date().toISOString()});localStorage.setItem('gacd_requests',JSON.stringify(r));f.reset();$('#cm').textContent='Saved locally ('+r.length+' total). Thanks!';draw()};
/* ---------- main loop ---------- */
function draw(){updHour();render();placeBubbles()}
$('#y').textContent=new Date().getFullYear();renderTasks();layout();addEventListener('resize',()=>{layout();draw()});
if(RM){AG.cto.bt=AG.cfo.bt=99;AG.cto.msg='Back to coding 💻';AG.cfo.msg='Checking the numbers 📊';draw()}
else{updHour();if(FF){for(let i=0;i<Math.round(FF*20);i++)update(.05)}draw();let last=performance.now(),acc=0,hacc=0;(function f(n){const dt=Math.min(.1,(n-last)/1000);last=n;acc+=dt;hacc+=dt;if(acc>=1/30){update(acc);acc=0;if(hacc>20){hacc=0}draw()}requestAnimationFrame(f)})(last)}
/* test/share helper: ?open=tasks | contact | cto | cfo */
{const o=Q.get('open');if(o==='tasks'||o==='contact')open(o);else if(o==='cto'||o==='cfo')show(o)}
