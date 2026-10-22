require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;
const DB = path.join(__dirname, 'data', 'db.json');
app.use(express.json({limit:'1mb'}));
app.use(express.static(path.join(__dirname,'public')));
const roles = {
  'Java Developer': {skills:['Java basics','OOP','Data structures','SQL','Git','Spring Boot'], projects:['Student Feedback Analysis System','Library Management API','Expense Tracker'], resources:[['Java tutorials','https://dev.java/learn/'],['SQL practice','https://sqlbolt.com/'],['Git handbook','https://git-scm.com/doc']]},
  'Frontend Developer': {skills:['HTML','CSS','JavaScript','Responsive design','Git','React'], projects:['Accessible portfolio website','Weather dashboard','Campus event finder'], resources:[['MDN Web Docs','https://developer.mozilla.org/'],['JavaScript guide','https://javascript.info/'],['React docs','https://react.dev/learn']]},
  'Data Analyst': {skills:['Spreadsheets','SQL','Python','Statistics','Data visualization','Storytelling'], projects:['Student performance dashboard','Public transport data analysis','Feedback sentiment report'], resources:[['Python tutorial','https://docs.python.org/3/tutorial/'],['SQLBolt','https://sqlbolt.com/'],['Kaggle Learn','https://www.kaggle.com/learn']]},
  'AI/ML Engineer': {skills:['Python','Math foundations','Data handling','Machine learning','Model evaluation','Git'], projects:['Student feedback classifier','House-price prediction','Study-time recommender'], resources:[['Python tutorial','https://docs.python.org/3/tutorial/'],['Google ML Crash Course','https://developers.google.com/machine-learning/crash-course'],['Kaggle Learn','https://www.kaggle.com/learn']]},
  'Cybersecurity Analyst': {skills:['Networking','Linux','Security fundamentals','Python scripting','Log analysis','Incident reporting'], projects:['Password-strength checker','Security log analyzer','Phishing awareness toolkit'], resources:[['Cisco Skills for All','https://skillsforall.com/'],['OverTheWire','https://overthewire.org/wargames/'],['OWASP','https://owasp.org/']]}
};
function readDB(){try{return JSON.parse(fs.readFileSync(DB,'utf8'))}catch{return {profiles:[]}}}
function writeDB(db){fs.mkdirSync(path.dirname(DB),{recursive:true});fs.writeFileSync(DB,JSON.stringify(db,null,2))}
function roadmap(role, gaps, hours){
 const weeks = [
  {title:'Build the foundation',goal:'Learn the core concepts and vocabulary',tasks:[`Study ${gaps[0]||'the fundamentals'} for 2 focused sessions`,'Write short notes and complete 5 practice questions','Explain one concept in your own words']},
  {title:'Practice deliberately',goal:'Turn concepts into repeatable skills',tasks:[`Practice ${gaps[1]||gaps[0]||'core skills'} with small exercises`,'Solve 3 beginner-level problems','Review mistakes and record what changed']},
  {title:'Build something real',goal:'Apply your learning in a small project',tasks:[`Start: ${roles[role].projects[0]}`,'Complete one useful feature and test it','Write a short README with screenshots or examples']},
  {title:'Polish and demonstrate',goal:'Make progress visible and prepare to explain it',tasks:['Finish and test the project','Publish code or a project summary in your portfolio','Practise a 2-minute explanation and choose the next milestone']}
 ];
 return weeks.map((w,i)=>({...w,week:i+1,estimatedHours:Math.max(1,Math.round(hours/4)),tasks:w.tasks.map((title,j)=>({id:`w${i+1}t${j+1}`,title,done:false}))}));
}
app.get('/api/health',(req,res)=>res.json({ok:true,service:'SkillBridge AI API',aiConfigured:Boolean(process.env.OPENAI_API_KEY),storage:'local JSON file'}));
app.get('/api/roles',(req,res)=>res.json(Object.entries(roles).map(([name,v])=>({name,skills:v.skills,projects:v.projects,resources:v.resources}))));
app.post('/api/assess',(req,res)=>{
 const {name,role,studyHours=5,skills={}}=req.body||{};
 if(!name||!String(name).trim())return res.status(400).json({error:'Please enter your name.'});
 if(!roles[role])return res.status(400).json({error:'Please choose a supported career.'});
 const hours=Number(studyHours); if(!Number.isFinite(hours)||hours<1||hours>60)return res.status(400).json({error:'Study hours must be between 1 and 60 per week.'});
 const all=roles[role].skills;
 const normalized=Object.fromEntries(all.map(s=>[s,Math.max(0,Math.min(5,Number(skills[s]||0)))]));
 const gaps=all.filter(s=>normalized[s]<3).sort((a,b)=>normalized[a]-normalized[b]);
 const profile={id:crypto.randomUUID(),name:String(name).trim(),role,studyHours:hours,skills:normalized,gaps,roadmap:roadmap(role,gaps,hours),projects:roles[role].projects,resources:roles[role].resources,createdAt:new Date().toISOString()};
 const db=readDB();db.profiles.unshift(profile);writeDB(db);res.status(201).json(profile);
});
app.get('/api/profiles',(req,res)=>res.json(readDB().profiles.map(({id,name,role,studyHours,createdAt,roadmap})=>({id,name,role,studyHours,createdAt,completed:roadmap.flatMap(w=>w.tasks).filter(t=>t.done).length,total:roadmap.flatMap(w=>w.tasks).length}))));
app.get('/api/profiles/:id',(req,res)=>{const p=readDB().profiles.find(p=>p.id===req.params.id);p?res.json(p):res.status(404).json({error:'Profile not found.'})});
app.patch('/api/profiles/:id/tasks/:taskId',(req,res)=>{const db=readDB();const p=db.profiles.find(p=>p.id===req.params.id);if(!p)return res.status(404).json({error:'Profile not found.'});let task;for(const w of p.roadmap)for(const t of w.tasks)if(t.id===req.params.taskId)task=t;if(!task)return res.status(404).json({error:'Task not found.'});task.done=Boolean(req.body.done);writeDB(db);res.json(p)});
app.delete('/api/profiles/:id',(req,res)=>{const db=readDB(),before=db.profiles.length;db.profiles=db.profiles.filter(p=>p.id!==req.params.id);if(db.profiles.length===before)return res.status(404).json({error:'Profile not found.'});writeDB(db);res.json({ok:true})});
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,()=>console.log(`SkillBridge AI running at http://localhost:${PORT}`));
