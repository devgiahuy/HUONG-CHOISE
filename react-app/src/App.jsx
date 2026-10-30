import { useEffect, useMemo, useState } from 'react'
import questions from './data/questions.json'
import './App.css'

const sets = [{id:'cs-0',label:'Cơ sở',detail:'Đề trắc nghiệm'}, {id:'cm-0',label:'Chuyên môn',detail:'Đề trắc nghiệm'}, {id:'cs-1',label:'Cơ sở',detail:'Câu hỏi bổ sung'}, {id:'cm-1',label:'Chuyên môn',detail:'Câu hỏi bổ sung'}]
const KEY = 'on-thi-moi-gioi-v1'
function readSaved() { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } }
function Icon({name, size=18}) { const paths={home:<><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5M9 21v-7h6v7"/></>,list:<><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></>,star:<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>,wrong:<><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/></>,chevron:<path d="m9 18 6-6-6-6"/>,search:<><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></>,check:<path d="m5 12 4 4L19 6"/>,menu:<path d="M4 6h16M4 12h16M4 18h16"/>};return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg> }

export default function App(){
 const [saved] = useState(readSaved)
 const [answers,setAnswers]=useState(saved.answers || {})
 const [stars,setStars]=useState(saved.stars || {})
 const [setId,setSetId]=useState(saved.setId || 'cs-0')
 const [currentId,setCurrentId]=useState(saved.currentId || questions.find(q=>q.set==='cs-0')?.id)
 const [view,setView]=useState('study')
 const [query,setQuery]=useState('')
 const [revealed,setRevealed]=useState(false)
 const [menu,setMenu]=useState(false)
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify({answers,stars,setId,currentId}))}catch{}},[answers,stars,setId,currentId])
 const section=questions.filter(q=>q.set===setId)
 const current=questions.find(q=>q.id===currentId) || section[0]
 const recorded=current ? answers[current.id] : null
 const selection=recorded?.choice
 const activeSet=sets.find(s=>s.id===setId) || sets[0]
 const totalAnswered=Object.values(answers).filter(a=>a.result==='correct'||a.result==='wrong').length
 const totalWrong=Object.values(answers).filter(a=>a.result==='wrong').length
 const totalStars=Object.values(stars).filter(Boolean).length
 const sectionDone=section.filter(q=>answers[q.id]?.result).length
 const filtered=useMemo(()=>questions.filter(q=>{
  if(view==='wrong' && answers[q.id]?.result!=='wrong')return false
  if(view==='stars' && !stars[q.id])return false
  if(view==='list' && q.set!==setId)return false
  return `${q.prompt} ${q.number} ${q.subject}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi'))
 }),[view,answers,stars,setId,query])
 function chooseSet(id){setSetId(id);setCurrentId(questions.find(q=>q.set===id)?.id);setView('study');setRevealed(false);setMenu(false)}
 function openQuestion(q){setSetId(q.set);setCurrentId(q.id);setView('study');setRevealed(false);setMenu(false)}
 function navigate(delta){const i=section.findIndex(q=>q.id===current?.id);const next=section[i+delta];if(next){setCurrentId(next.id);setRevealed(false);window.scrollTo({top:0,behavior:'smooth'})}}
 function submit(choice){if(!current?.answer)return;setAnswers(a=>({...a,[current.id]:{choice,result:choice===current.answer?'correct':'wrong'}}))}
 function selfGrade(result){setAnswers(a=>({...a,[current.id]:{choice:null,result}}))}
 function retry(){setAnswers(a=>{const copy={...a};delete copy[current.id];return copy});setRevealed(false)}
 function setPage(next){setView(next);setQuery('');setMenu(false)}
 const index=section.findIndex(q=>q.id===current?.id)
 return <div className="app-shell">
  <aside className={`sidebar ${menu?'sidebar-open':''}`}>
   <div className="brand"><span className="brand-mark">HC</span><div><strong>Hướng Chọn</strong><small>Ôn thi môi giới BĐS</small></div></div>
   <nav aria-label="Điều hướng chính">
    <p className="nav-label">HỌC TẬP</p>
    <button className={view==='study'?'nav-item active':'nav-item'} onClick={()=>setPage('study')}><Icon name="home"/> Học câu hỏi <span>→</span></button>
    <button className={view==='list'?'nav-item active':'nav-item'} onClick={()=>setPage('list')}><Icon name="list"/> Danh sách câu hỏi <span>{section.length}</span></button>
    <button className={view==='wrong'?'nav-item active':'nav-item'} onClick={()=>setPage('wrong')}><Icon name="wrong"/> Câu trả lời sai <span>{totalWrong}</span></button>
    <button className={view==='stars'?'nav-item active':'nav-item'} onClick={()=>setPage('stars')}><Icon name="star"/> Câu cần chú ý <span>{totalStars}</span></button>
    <p className="nav-label nav-label-spaced">BỘ CÂU HỎI</p>
    {sets.map(s=><button key={s.id} className={`set-link ${setId===s.id?'selected':''}`} onClick={()=>chooseSet(s.id)}><span className="set-dot"/><span><strong>{s.label}</strong><small>{s.detail}</small></span><span className="set-count">{questions.filter(q=>q.set===s.id).length}</span></button>)}
   </nav>
   <div className="sidebar-footer"><div className="progress-copy"><span>Tiến độ của bạn</span><strong>{totalAnswered}/{questions.length}</strong></div><div className="progress-track"><span style={{width:`${totalAnswered/questions.length*100}%`}}/></div><p>Tiến độ được lưu trên trình duyệt này.</p></div>
  </aside>
  {menu&&<button className="backdrop" aria-label="Đóng menu" onClick={()=>setMenu(false)}/>}
  <main className="main">
   <header className="topbar"><button className="menu-button" onClick={()=>setMenu(true)} aria-label="Mở menu"><Icon name="menu"/></button><div className="breadcrumb">Học tập <span>/</span> <strong>{view==='study'?'Luyện câu hỏi':view==='list'?'Danh sách câu hỏi':view==='wrong'?'Câu trả lời sai':'Câu cần chú ý'}</strong></div><div className="save-indicator"><span/> Đã lưu trên máy</div></header>
   {view==='study' && current ? <div className="workspace">
    <div className="page-title"><div><h1>Luyện câu hỏi</h1><p>Mỗi ngày một chút, vững vàng hơn khi đi thi.</p></div><button className="outline-btn list-button" onClick={()=>setPage('list')}><Icon name="list"/> Danh sách câu hỏi</button></div>
    <div className="study-layout"><section className="question-card">
      <div className="question-top"><div className="source-tag">{activeSet.label} <span>·</span> {activeSet.detail}</div><button className={`star-button ${stars[current.id]?'starred':''}`} aria-label={stars[current.id]?'Bỏ đánh dấu câu hỏi':'Đánh dấu câu cần chú ý'} aria-pressed={!!stars[current.id]} onClick={()=>setStars(s=>({...s,[current.id]:!s[current.id]}))}><Icon name="star" size={19}/><span>{stars[current.id]?'Đã đánh dấu':'Đánh dấu'}</span></button></div>
      <div className="question-heading"><span className="question-number">Câu {current.number}</span><span className="page-ref">Trang {current.page} trong PDF</span></div>
      <h2>{current.prompt}</h2>
      {current.options.length>1 ? <><p className="instruction">{current.answer?'Chọn một đáp án bên dưới':'Tài liệu chưa đánh dấu đáp án cho câu này.'}</p><div className="options">{current.options.map(o=>{let state='';if(recorded && current.answer){if(o.id===current.answer)state='correct';else if(o.id===selection)state='incorrect'}return <button key={o.id} className={`option ${state}`} onClick={()=>submit(o.id)} disabled={!!recorded || !current.answer}><span className="option-letter">{o.id}</span><span>{o.text}</span>{state&&<span className="option-state"><Icon name={state==='correct'?'check':'wrong'} size={18}/></span>}</button>})}</div></> : <div className="flashcard"><p>Phần này trong tài liệu chỉ ghi đáp án. Hãy nghĩ câu trả lời trước khi xem.</p>{!revealed&&!recorded&&<button className="primary-btn" onClick={()=>setRevealed(true)}>Xem đáp án <Icon name="chevron"/></button>}</div>}
      {(recorded || revealed) && <div className={`feedback ${recorded?.result==='wrong'?'feedback-wrong':'feedback-good'}`} role="status"><div className="feedback-title"><Icon name={recorded?.result==='wrong'?'wrong':'check'}/><strong>{recorded ? recorded.result==='correct'?'Chính xác!':'Cần ôn lại câu này':'Đáp án trong tài liệu'}</strong></div><p>{current.answer ? <><b>Đáp án {current.answer}:</b> {current.options.find(o=>o.id===current.answer)?.text}</>:'Tài liệu không ghi rõ đáp án cho câu này.'}</p><div className="explanation"><b>Giải thích</b><p>{current.explanation || 'Tài liệu gốc không có giải thích chi tiết cho câu này. Nội dung trên là đáp án được ghi hoặc đánh dấu trong tài liệu.'}</p></div>{current.options.length<=1 && !recorded && <div className="self-grade"><span>Bạn có nhớ đúng không?</span><button onClick={()=>selfGrade('wrong')}>Cần ôn lại</button><button onClick={()=>selfGrade('correct')}>Đã nhớ</button></div>}</div>}
      {!current.answer && current.options.length>1 && <p className="source-note">Bạn có thể đánh dấu sao để quay lại kiểm tra câu này sau.</p>}
      <div className="card-actions"><button className="text-btn" onClick={()=>navigate(-1)} disabled={index<=0}>← Câu trước</button><div>{recorded && <button className="text-btn retry" onClick={retry}>Làm lại</button>}<button className="primary-btn" onClick={()=>navigate(1)} disabled={index>=section.length-1}>Câu tiếp theo <Icon name="chevron"/></button></div></div>
     </section>
     <aside className="study-aside"><div className="aside-panel"><div className="aside-heading"><div><h3>Tiến độ bộ này</h3><p>{activeSet.label} · {activeSet.detail}</p></div><strong>{sectionDone}/{section.length}</strong></div><div className="progress-track light"><span style={{width:`${sectionDone/section.length*100}%`}}/></div><div className="legend"><span><i className="dot-done"/> Đã học</span><span><i className="dot-current"/> Đang xem</span><span><i/> Chưa học</span></div><div className="question-grid">{section.map((q,i)=><button key={q.id} className={`${q.id===current.id?'current ':''}${answers[q.id]?.result||''}`} onClick={()=>{setCurrentId(q.id);setRevealed(false)}} title={`Câu ${q.number}`} aria-label={`Câu ${q.number}${answers[q.id]?.result==='wrong'?', trả lời sai':''}`} aria-current={q.id===current.id?'true':undefined}>{i+1}</button>)}</div><button className="grid-link" onClick={()=>setPage('list')}>Xem danh sách câu hỏi <Icon name="chevron" size={16}/></button></div><div className="tip"><strong>Học theo cách của bạn</strong><p>Đánh dấu những câu cần chú ý, hoặc quay lại ôn các câu trả lời sai bất cứ lúc nào.</p></div></aside>
    </div>
   </div> : <div className="workspace"><div className="page-title"><div><h1>{view==='list'?'Danh sách câu hỏi':view==='wrong'?'Câu trả lời sai':'Câu cần chú ý'}</h1><p>{view==='list'?`${activeSet.label} · ${activeSet.detail}`:view==='wrong'?'Những câu bạn đã trả lời sai hoặc cần ôn lại.':'Các câu bạn đã đánh dấu để xem lại.'}</p></div><button className="outline-btn" onClick={()=>setPage('study')}>Tiếp tục học <Icon name="chevron"/></button></div><div className="list-panel"><div className="list-toolbar"><span>{filtered.length} câu hỏi</span><label className="search"><Icon name="search"/><input placeholder="Tìm trong câu hỏi..." value={query} onChange={e=>setQuery(e.target.value)}/></label></div>{filtered.length ? <div className="question-list">{filtered.map(q=><button key={q.id} className="question-row" onClick={()=>openQuestion(q)}><span className="row-number">{q.number}</span><span className="row-body"><strong>{q.prompt}</strong><small>{q.subject} · Trang {q.page} {stars[q.id]?'· Đã đánh dấu':''}</small></span><span className={`row-status ${answers[q.id]?.result||''}`}>{answers[q.id]?.result==='correct'?'Đúng':answers[q.id]?.result==='wrong'?'Cần ôn':'Chưa học'}</span><Icon name="chevron" size={17}/></button>)}</div> : <div className="empty"><div className="empty-icon"><Icon name={view==='stars'?'star':view==='wrong'?'wrong':'search'} size={26}/></div><h2>{query?'Không tìm thấy câu hỏi':view==='wrong'?'Chưa có câu nào cần ôn lại':view==='stars'?'Chưa có câu nào được đánh dấu':'Không có câu hỏi'}</h2><p>{query?'Thử một từ khóa khác nhé.':view==='stars'?'Nhấn vào dấu sao trong khi học để lưu câu hỏi vào đây.':'Hãy bắt đầu học và theo dõi tiến độ của bạn.'}</p><button className="outline-btn" onClick={()=>setPage('study')}>Đến câu hỏi</button></div>}</div></div>}
  </main>
 </div>
}
