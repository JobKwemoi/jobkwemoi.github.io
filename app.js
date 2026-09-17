"use strict";

const API_IMAGE="/api/image", API_CHAT="/api/chat", API_USER="/api/memory?scope=profile", API_MEMORY="/api/memory", API_PROJECT_MEMORY="/api/memory?scope=project", API_GENERATORS="/api/generators", API_SYNC="/api/sync", API_PROJECTS="/api/projects", API_FILES="/api/files", API_RESEARCH="/api/research", API_FILE_INSIGHT="/api/files", API_AGENT="/api/agent", API_CUSTOM_AGENTS="/api/agent?resource=custom", API_PAYMENT="/api/payment", API_PAYMENT_STATUS="/api/payment?action=status", API_AUTH="/api/auth";
const MAX_HISTORY_ITEMS=12, MAX_STORED_CHATS=50, MAX_STORED_MESSAGES=80, REQUEST_TIMEOUT=120000;
const STORAGE={chats:"kirong_chats_v2",activeChat:"kirong_active_chat_v2",deviceId:"kirong_device_id_v2",searchOn:"kirong_search_on_v2",projectId:"kirong_project_id_v1",imageGallery:"kirong_image_gallery_v1",workflowRuns:"kirong_workflow_runs_v1",sessionToken:"kirong_session_token_v1"};
const chatBox=document.getElementById("chatBox"), userInput=document.getElementById("userInput"), composer=document.getElementById("composer"), sendBtn=document.getElementById("sendBtn"), thinking=document.getElementById("thinking"), fileInput=document.getElementById("fileInput"), attachBtn=document.getElementById("attachBtn"), filePreview=document.getElementById("filePreview"), searchToggleBtn=document.getElementById("searchToggleBtn"), usageBtn=document.getElementById("usageBtn"), voiceBtn=document.getElementById("voiceBtn"), exportBtn=document.getElementById("exportBtn"), usageBarWrap=document.getElementById("usageBarWrap"), usageBarFill=document.getElementById("usageBarFill"), usageBarPercent=document.getElementById("usageBarPercent"), modeBanner=document.getElementById("modeBanner"), topBarTitle=document.getElementById("topBarTitle"), projectSelect=document.getElementById("projectSelect"), projectQuickBtn=document.getElementById("projectQuickBtn");

const researchForm=document.getElementById("researchForm"), researchPrompt=document.getElementById("researchPrompt"), researchToChatBtn=document.getElementById("researchToChatBtn"), researchAsAgentBtn=document.getElementById("researchAsAgentBtn"), researchSubmitBtn=document.getElementById("researchSubmitBtn"), researchResultBox=document.getElementById("researchResultBox"), researchResultQuery=document.getElementById("researchResultQuery"), researchAnswerText=document.getElementById("researchAnswerText"), researchSourcesList=document.getElementById("researchSourcesList"), researchExportBtn=document.getElementById("researchExportBtn"), researchFollowUpForm=document.getElementById("researchFollowUpForm"), researchFollowUpInput=document.getElementById("researchFollowUpInput"), researchHistoryList=document.getElementById("researchHistoryList"), agentGrid=document.getElementById("agentGrid"), missionStats=document.getElementById("missionStats"), missionProjectCount=document.getElementById("missionProjectCount"), missionFileCount=document.getElementById("missionFileCount"), missionRunCount=document.getElementById("missionRunCount"), missionChatCount=document.getElementById("missionChatCount"), workflowRuns=document.getElementById("workflowRuns"), clearWorkflowHistoryBtn=document.getElementById("clearWorkflowHistoryBtn"), workflowModalOverlay=document.getElementById("workflowModalOverlay"), workflowModalClose=document.getElementById("workflowModalClose"), workflowCancelBtn=document.getElementById("workflowCancelBtn"), workflowForm=document.getElementById("workflowForm"), workflowBrief=document.getElementById("workflowBrief"), workflowProject=document.getElementById("workflowProject"), workflowModalTitle=document.getElementById("workflowModalTitle"), workflowModalDescription=document.getElementById("workflowModalDescription"), workflowModalKicker=document.getElementById("workflowModalKicker"),
sidebar=document.getElementById("sidebar"), sidebarToggle=document.getElementById("sidebarToggle"), sidebarCloseBtn=document.getElementById("sidebarCloseBtn"), sidebarOverlay=document.getElementById("sidebarOverlay"), sidebarNewChatBtn=document.getElementById("sidebarNewChatBtn"), sidebarHistoryList=document.getElementById("sidebarHistoryList"), historyList=document.getElementById("historyList"), historySearchInput=document.getElementById("historySearchInput"), planBadgeBox=document.getElementById("planBadgeBox"), planBadgeLabel=document.getElementById("planBadgeLabel"), planBadgeSub=document.getElementById("planBadgeSub"),
accountBadgeBtn=document.getElementById("accountBadgeBtn"), accountAvatar=document.getElementById("accountAvatar"), accountBadgeLabel=document.getElementById("accountBadgeLabel"), accountBadgeSub=document.getElementById("accountBadgeSub"),
authModalOverlay=document.getElementById("authModalOverlay"), authModalClose=document.getElementById("authModalClose"), authModalTitle=document.getElementById("authModalTitle"), authModalSub=document.getElementById("authModalSub"),
authSignedOut=document.getElementById("authSignedOut"), authSignedIn=document.getElementById("authSignedIn"), authForm=document.getElementById("authForm"),
authName=document.getElementById("authName"), authEmail=document.getElementById("authEmail"), authPassword=document.getElementById("authPassword"),
authError=document.getElementById("authError"), authSignupHint=document.getElementById("authSignupHint"), authSwitchBtn=document.getElementById("authSwitchBtn"),
authSubmitBtn=document.getElementById("authSubmitBtn"), authAccountEmail=document.getElementById("authAccountEmail"), authSignOutBtn=document.getElementById("authSignOutBtn"), generatorGrid=document.getElementById("generatorGrid"), generatorModalOverlay=document.getElementById("generatorModalOverlay"), generatorModalBox=document.getElementById("generatorModalBox"), memoryProfile=document.getElementById("memoryProfile"), memoryFacts=document.getElementById("memoryFacts"), forgetAllBtn=document.getElementById("forgetAllBtn"), projectMemorySection=document.getElementById("projectMemorySection"), projectMemoryName=document.getElementById("projectMemoryName"), projectMemoryForm=document.getElementById("projectMemoryForm"), projectMemoryInput=document.getElementById("projectMemoryInput"), projectMemoryFacts=document.getElementById("projectMemoryFacts"), forgetProjectMemoryBtn=document.getElementById("forgetProjectMemoryBtn"), projectPermissionsSection=document.getElementById("projectPermissionsSection"), projectPermissionsName=document.getElementById("projectPermissionsName"), projectPermissionsList=document.getElementById("projectPermissionsList"),
customAgentGrid=document.getElementById("customAgentGrid"), createCustomAgentBtn=document.getElementById("createCustomAgentBtn"),
customAgentModalOverlay=document.getElementById("customAgentModalOverlay"), customAgentModalTitle=document.getElementById("customAgentModalTitle"), customAgentModalClose=document.getElementById("customAgentModalClose"),
customAgentForm=document.getElementById("customAgentForm"), customAgentId=document.getElementById("customAgentId"), customAgentIcon=document.getElementById("customAgentIcon"),
customAgentName=document.getElementById("customAgentName"), customAgentDescription=document.getElementById("customAgentDescription"), customAgentInstructions=document.getElementById("customAgentInstructions"),
customAgentToolList=document.getElementById("customAgentToolList"), customAgentDeleteBtn=document.getElementById("customAgentDeleteBtn"), customAgentCancelBtn=document.getElementById("customAgentCancelBtn"), projectGrid=document.getElementById("projectGrid"), projectModalOverlay=document.getElementById("projectModalOverlay"), projectModalClose=document.getElementById("projectModalClose"), projectCancelBtn=document.getElementById("projectCancelBtn"), projectForm=document.getElementById("projectForm"), projectName=document.getElementById("projectName"), projectDescription=document.getElementById("projectDescription"), projectInstructions=document.getElementById("projectInstructions"), newProjectBtn=document.getElementById("newProjectBtn"), uploadFileBtn=document.getElementById("uploadFileBtn"), workspaceFileInput=document.getElementById("workspaceFileInput"), workspaceFileList=document.getElementById("workspaceFileList"), workspaceStatus=document.getElementById("workspaceStatus"), fileToolInput=document.getElementById("fileToolInput"), fileToolResult=document.getElementById("fileToolResult"), fileToolResultText=document.getElementById("fileToolResultText"), fileToolCopyBtn=document.getElementById("fileToolCopyBtn"), imageGalleryGrid=document.getElementById("imageGalleryGrid"), clearImageGalleryBtn=document.getElementById("clearImageGalleryBtn"), imageStudioBtn=document.getElementById("imageStudioBtn"), imageModalOverlay=document.getElementById("imageModalOverlay"), imageModalClose=document.getElementById("imageModalClose"), imageCancelBtn=document.getElementById("imageCancelBtn"), imageForm=document.getElementById("imageForm"), imagePrompt=document.getElementById("imagePrompt"), imageAspectRatio=document.getElementById("imageAspectRatio"), imageGenerateBtn=document.getElementById("imageGenerateBtn"), imageResult=document.getElementById("imageResult");
let messages=[], selectedFiles=[], isSending=false, currentChatId=null, activeMode="chat", activeAbortController=null, userStoppedGeneration=false, searchOn=loadJSON(STORAGE.searchOn,false), generators=[], projects=[], savedFiles=[];
const agentLivePanel=document.getElementById("agentLivePanel"), agentLiveTitle=document.getElementById("agentLiveTitle"), agentLiveGoal=document.getElementById("agentLiveGoal"), agentLiveClose=document.getElementById("agentLiveClose"), agentSteps=document.getElementById("agentSteps"), agentResultBox=document.getElementById("agentResultBox"), agentResultTitle=document.getElementById("agentResultTitle"), agentResultText=document.getElementById("agentResultText"), agentCopyResultBtn=document.getElementById("agentCopyResultBtn"), agentSendToChatBtn=document.getElementById("agentSendToChatBtn"), agentConfirmBox=document.getElementById("agentConfirmBox"), agentConfirmQuestion=document.getElementById("agentConfirmQuestion"), agentHandoffBox=document.getElementById("agentHandoffBox"), agentResumeForm=document.getElementById("agentResumeForm"), agentResumeAnswer=document.getElementById("agentResumeAnswer"), agentApprovalBox=document.getElementById("agentApprovalBox"), agentApprovalReason=document.getElementById("agentApprovalReason"), agentApprovalRisk=document.getElementById("agentApprovalRisk"), agentApproveBtn=document.getElementById("agentApproveBtn"), agentDenyBtn=document.getElementById("agentDenyBtn"), memoryInsightText=document.getElementById("memoryInsightText"), memoryInsightRefreshBtn=document.getElementById("memoryInsightRefreshBtn");
let agentRunAbortController=null, currentAgentRunId=null;
const editBanner=document.getElementById("editBanner"), editBannerCancelBtn=document.getElementById("editBannerCancelBtn"), historyArchiveToggle=document.getElementById("historyArchiveToggle");
historyArchiveToggle?.addEventListener("click",()=>{showArchivedChats=!showArchivedChats;renderHistoryList()});
const STALE_RUN_MS=3*60*1000; // matches lib/agent-store.js STALE_AFTER_MS

function loadJSON(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
function saveJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
function getDeviceId(){let id=localStorage.getItem(STORAGE.deviceId);if(id)return id;try{id=crypto.randomUUID()}catch{}if(!id)id="device_"+Date.now()+"_"+Math.random().toString(36).slice(2);localStorage.setItem(STORAGE.deviceId,id);return id}
const DEVICE_ID=getDeviceId();
// The HttpOnly session cookie is the primary credential and rides
// along automatically on same-origin requests. The Bearer copy below
// is the fallback for the cross-site iframe embed on the portfolio,
// where a SameSite=Lax cookie is NOT sent at all. Sending both is
// harmless — the server prefers the cookie.
function getSessionToken(){try{return localStorage.getItem(STORAGE.sessionToken)||""}catch{return ""}}
function setSessionToken(token){try{token?localStorage.setItem(STORAGE.sessionToken,token):localStorage.removeItem(STORAGE.sessionToken)}catch{}}
function headers(extra={}){
  const h={...extra,"X-Kirong-Device":DEVICE_ID};
  const token=getSessionToken();
  if(token)h.Authorization=`Bearer ${token}`;
  return h;
}
function escapeHTML(v){const d=document.createElement("div");d.textContent=String(v??"");return d.innerHTML}
function createChatId(){return "chat_"+Date.now()+"_"+Math.random().toString(36).slice(2,9)}
function createChatTitle(t){const c=String(t||"").replace(/\s+/g," ").trim();return c?(c.length>48?c.slice(0,48)+"…":c):"New chat"}
function showToast(msg){let t=document.getElementById("kirongToast");if(!t){t=document.createElement("div");t.id="kirongToast";t.className="kirongToast";document.body.appendChild(t)}t.textContent=String(msg||"");t.classList.add("show");clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove("show"),2400)}
async function copyText(text){try{await navigator.clipboard.writeText(String(text||""));showToast("📋 Copied")}catch{showToast("⚠️ Copy failed")}}
function renderMarkdown(text){let source=String(text||""), blocks=[];source=source.replace(/```([\w+-]*)\n?([\s\S]*?)```/g,(_,lang,code)=>{const i=blocks.length;blocks.push({lang:lang||"",code:code.trim()});return `@@KCODE_${i}@@`});let html=escapeHTML(source);html=html.replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/^### (.*)$/gm,"<h4>$1</h4>").replace(/^## (.*)$/gm,"<h3>$1</h3>").replace(/^# (.*)$/gm,"<h2>$1</h2>").replace(/^[-•] (.*)$/gm,"<li>$1</li>");
html=html.replace(/(https?:\/\/[^\s<]+)/g,u=>`<a href="${u.replace(/[),.!?]+$/g,"")}" target="_blank" rel="noopener noreferrer">${u.replace(/[),.!?]+$/g,"")}</a>`);blocks.forEach((b,i)=>{html=html.replace(`@@KCODE_${i}@@`,`<div class="codeWrapper"><div class="codeHeader"><span>${escapeHTML(b.lang)}</span><button class="copyCodeBtn" data-copy="${encodeURIComponent(b.code)}">📋 Copy</button></div><pre class="codeBlock"><code>${escapeHTML(b.code)}</code></pre></div>`)});return html.replace(/\n/g,"<br>")}
chatBox?.addEventListener("click",e=>{const b=e.target.closest(".copyCodeBtn");if(!b)return;copyText(decodeURIComponent(b.dataset.copy||""))});
function isNearBottom(){return !chatBox||chatBox.scrollHeight-chatBox.scrollTop-chatBox.clientHeight<=120}
function scrollToBottom(force=false){if(!chatBox||(!force&&!isNearBottom()))return;requestAnimationFrame(()=>chatBox.scrollTo({top:chatBox.scrollHeight,behavior:"smooth"}))}

function switchTab(tab){document.querySelectorAll(".navBtn").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));document.querySelectorAll("[data-panel]").forEach(p=>{const on=p.id===tab;p.classList.toggle("active",on);p.hidden=!on});const titles={chat:"Chat",projects:"Projects",research:"Research",agents:"Agents",tools:"Tools",memory:"Memory",files:"Files",history:"History"};topBarTitle.textContent=titles[tab]||"Kirong AI";if(tab==="history")renderHistoryList();if(tab==="memory")loadMemoryPanel();if(tab==="projects")loadProjects();if(tab==="files")loadFiles();if(tab==="research")loadResearchHistory();if(tab==="agents")loadCustomAgents();closeSidebar()}
document.querySelectorAll(".navBtn").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
const WORKFLOW_PRESETS={
  research:{icon:"🔎",title:"Research Agent",description:"Plan → Search → Analyze → Verify → Report, with cited multi-source answers.",prompt:"Research this topic. Topic: "},
  coding:{icon:"🧑‍💻",title:"Coding Agent",description:"Understand → Plan → Write → Run → Fix → Explain — actually runs your code in a sandbox.",prompt:"Write/fix/explain this code task: "},
  business:{icon:"📈",title:"Business Agent",description:"Research → Analyze → Strategy → Action Plan for a real business decision.",prompt:"Help with this business decision: "},
  content:{icon:"✍️",title:"Content Agent",description:"Idea → Research → Draft → Improve → Final, ready to publish.",prompt:"Create this piece of content: "}
};

function getWorkflowRuns(){return loadJSON(STORAGE.workflowRuns,[]).filter(x=>x&&x.id).slice(0,20)}
function saveWorkflowRun(run){const runs=getWorkflowRuns();runs.unshift(run);saveJSON(STORAGE.workflowRuns,runs.slice(0,20));renderMissionCenter()}
const RUN_STATUS_BADGE={running:"🔵 Running",needs_approval:"🟡 Needs approval",needs_confirmation:"⏳ Needs your answer",done:"🟢 Done",failed:"🔴 Failed"};
function renderMissionCenter(){
  if(missionProjectCount)missionProjectCount.textContent=String(projects.length);
  if(missionFileCount)missionFileCount.textContent=String(savedFiles.length);
  const runs=getWorkflowRuns();
  if(missionRunCount)missionRunCount.textContent=String(runs.length);
  const chats=loadJSON(STORAGE.chats,[]);
  if(missionChatCount)missionChatCount.textContent=String(Array.isArray(chats)?chats.length:0);
  if(!workflowRuns)return;
  if(!runs.length){workflowRuns.innerHTML='<p class="emptyText">No workflow runs yet. Launch one above and it will appear here.</p>';return}
  workflowRuns.innerHTML=runs.slice(0,10).map(r=>{
    const stuck=r.runId&&["running","needs_approval","needs_confirmation"].includes(r.status)&&(Date.now()-(r.updatedAt||r.createdAt||0)>STALE_RUN_MS);
    const badge=RUN_STATUS_BADGE[r.status]||"";
    const openable=r.runId?` data-open-run="${escapeHTML(r.runId)}"`:"";
    return `<div class="workflowRun${stuck?" stuck":""}"${openable}><span class="workflowRunIcon">${escapeHTML(r.icon||"🤖")}</span><div><strong>${escapeHTML(r.title||"Workflow")}</strong><small>${escapeHTML(r.brief||"")}</small></div><span class="workflowRunStatus">${badge}</span><span class="workflowRunTime">${new Date(r.createdAt||Date.now()).toLocaleString([], {month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</span></div>`;
  }).join("");
}
workflowRuns?.addEventListener("click",e=>{
  const row=e.target.closest("[data-open-run]");
  if(!row)return;
  const runId=row.dataset.openRun;
  const runEntry=getWorkflowRuns().find(r=>r.runId===runId);
  if(runEntry)recoverAgentWorkflow(runEntry);
});
function syncWorkflowProjectOptions(){
  if(!workflowProject)return;
  const current=projectSelect?.value||localStorage.getItem(STORAGE.projectId)||"";
  workflowProject.innerHTML='<option value="">Current chat context</option>'+projects.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)}</option>`).join("");
  if(projects.some(p=>p.id===current))workflowProject.value=current;
}
function getWorkflowMeta(kind){
  if(String(kind||"").startsWith("custom_agent:")){
    const agent=customAgents.find(a=>`custom_agent:${a.id}`===kind);
    if(agent)return{icon:agent.icon||"🤖",title:agent.name,description:agent.description||"Custom agent",prompt:""};
  }
  return WORKFLOW_PRESETS[kind]||WORKFLOW_PRESETS.research;
}
function openWorkflowModal(kind,promptOverride=""){
  const preset=getWorkflowMeta(kind);
  workflowModalKicker.textContent=`${preset.icon} ${preset.title}`;
  workflowModalTitle.textContent=preset.title;
  workflowModalDescription.textContent=preset.description;
  workflowBrief.value=String(promptOverride||"");
  syncWorkflowProjectOptions();
  workflowModalOverlay.classList.remove("hidden");
  setTimeout(()=>workflowBrief.focus(),0);
  workflowModalOverlay.dataset.kind=kind;
}
function closeWorkflowModal(){workflowModalOverlay?.classList.add("hidden")}

function agentStepIcon(action){return {web_search:"🔎",deep_research:"🧭",generate_image:"🎨",write_file:"📄",read_file:"📖",update_project:"🗂️",draft_whatsapp:"📱",workspace_write:"🗒️",workspace_read:"🗒️",workspace_list:"🗂️",run_calculation:"🧮",run_code:"🧪",delegate:"🤝",use_skill:"🧩"}[action]||"⚙️"}
function agentStepLabel(action){return {web_search:"Searching the web",deep_research:"Running deep research",generate_image:"Generating image",write_file:"Saving file",read_file:"Reading file",update_project:"Updating project",draft_whatsapp:"Drafting WhatsApp message",workspace_write:"Saving scratch note",workspace_read:"Reading scratch note",workspace_list:"Listing scratch workspace",run_calculation:"Calculating",run_code:"Running code in sandbox",delegate:"Delegating to a sub-agent",use_skill:"Running a skill"}[action]||action}
function riskEmoji(level){return {low:"🟢",medium:"🟠",high:"🔴"}[level]||"🟠"}

function addAgentStepRow(event){
  if(!agentSteps)return;
  const row=document.createElement("div");
  row.className=`agentStep ${event.ok===false?"fail":"ok"}`;
  row.innerHTML=`<span class="agentStepIcon">${agentStepIcon(event.action)}</span><div><strong>${escapeHTML(event.label||agentStepLabel(event.action))}</strong></div>`;
  if(event.imageUrl){const img=document.createElement("img");img.src=event.imageUrl;img.className="agentStepImg";img.alt="Generated image";row.querySelector("div").appendChild(img)}
  if(event.undo&&event.index){
    const undoBtn=document.createElement("button");
    undoBtn.className="agentStepUndoBtn";
    undoBtn.textContent=`↩️ Undo`;
    undoBtn.title=event.undo.label||"Undo this step";
    undoBtn.onclick=()=>undoAgentStep(currentAgentRunId,event.index-1,undoBtn);
    row.appendChild(undoBtn);
  }
  agentSteps.appendChild(row);
  agentSteps.scrollTop=agentSteps.scrollHeight;
}

async function undoAgentStep(runId,stepIndex,buttonEl){
  if(!runId)return showToast("⚠️ Can't undo — no active run");
  if(buttonEl){buttonEl.disabled=true;buttonEl.textContent="Undoing…"}
  try{
    const r=await fetch("/api/agent",{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify({runId,undoStepIndex:stepIndex})});
    const d=await r.json();
    if(!d.ok){showToast(`⚠️ ${d.error||"Undo failed"}`);if(buttonEl){buttonEl.disabled=false;buttonEl.textContent="↩️ Undo"}return}
    if(buttonEl){buttonEl.textContent="✅ Undone";buttonEl.disabled=true}
    showToast("↩️ Undone");
    loadFiles?.();
  }catch(error){showToast(`⚠️ ${error?.message||"Undo failed"}`);if(buttonEl){buttonEl.disabled=false;buttonEl.textContent="↩️ Undo"}}
}

function renderAgentHandoff(handoff){
  if(!agentHandoffBox)return;
  if(!handoff){agentHandoffBox.classList.add("hidden");agentHandoffBox.innerHTML="";return}
  agentHandoffBox.classList.remove("hidden");
  if(handoff.type==="whatsapp"){
    agentHandoffBox.innerHTML=`<strong>📱 Drafted message:</strong><p>${escapeHTML(handoff.message)}</p><a class="primaryBtn" href="${escapeHTML(handoff.waLink)}" target="_blank" rel="noopener noreferrer">Open WhatsApp to send</a>`;
  }
}

async function streamAgentRequest(payload,{onStep,onFinal,onConfirm,onApproval,onError,onRunId}){
  const response=await fetch("/api/agent",{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify(payload)});
  if(!response.ok&&!response.body?.getReader){
    const d=await response.json().catch(()=>({}));
    throw new Error(d.error||`Server error ${response.status}`);
  }
  const handle=(event)=>{
    if(event.runId&&event.runId!==currentAgentRunId){currentAgentRunId=event.runId;onRunId?.(event.runId)}
    if(event.type==="step")onStep?.(event);
    else if(event.type==="final")onFinal?.(event);
    else if(event.type==="needs_confirmation")onConfirm?.(event);
    else if(event.type==="needs_approval")onApproval?.(event);
    else if(event.type==="error")onError?.(event);
  };
  const reader=response.body?.getReader();
  if(reader){
    const decoder=new TextDecoder();let buffer="";
    while(true){
      const {value,done}=await reader.read();
      if(done)break;
      buffer+=decoder.decode(value,{stream:true});
      const lines=buffer.split("\n");buffer=lines.pop()||"";
      for(const line of lines){if(line.trim())try{handle(JSON.parse(line))}catch{}}
    }
    if(buffer.trim())try{handle(JSON.parse(buffer))}catch{}
  }
}

function updateWorkflowRunStatus(runEntry,status,extra={}){
  runEntry.status=status;Object.assign(runEntry,extra);
  saveJSON(STORAGE.workflowRuns,getWorkflowRuns().map(r=>r.id===runEntry.id?runEntry:r));
  renderMissionCenter();
}

async function runAgentWorkflow(kind,goal,projectId){
  const preset=getWorkflowMeta(kind);
  const runEntry={id:createChatId(),runId:null,kind,icon:preset.icon,title:preset.title,brief:goal,projectId,createdAt:Date.now(),status:"running"};
  saveWorkflowRun(runEntry);
  switchTab("agents");
  closeWorkflowModal();

  agentLivePanel?.classList.remove("hidden");
  if(agentLiveTitle)agentLiveTitle.textContent=`${preset.icon} ${preset.title} — running…`;
  if(agentLiveGoal)agentLiveGoal.textContent=goal;
  if(agentSteps)agentSteps.innerHTML="";
  agentResultBox?.classList.add("hidden");
  agentConfirmBox?.classList.add("hidden");
  agentApprovalBox?.classList.add("hidden");
  renderAgentHandoff(null);
  currentAgentRunId=null;

  try{
    await streamAgentRequest({goal,kind,projectId:projectId||undefined},{
      onRunId:(runId)=>updateWorkflowRunStatus(runEntry,runEntry.status,{runId}),
      onStep:(event)=>{agentApprovalBox?.classList.add("hidden");addAgentStepRow(event)},
      onFinal:(event)=>{
        if(agentLiveTitle)agentLiveTitle.textContent=`${preset.icon} ${preset.title} — done ✅`;
        agentApprovalBox?.classList.add("hidden");
        agentResultBox?.classList.remove("hidden");
        if(agentResultTitle)agentResultTitle.textContent=`✅ ${event.summary||"Done"}`;
        if(agentResultText)agentResultText.textContent=event.result||"";
        renderAgentHandoff(event.handoff);
        updateWorkflowRunStatus(runEntry,"done",{result:event.result||""});
        loadFiles?.();
      },
      onConfirm:(event)=>{
        if(agentLiveTitle)agentLiveTitle.textContent=`${preset.icon} ${preset.title} — needs you`;
        agentApprovalBox?.classList.add("hidden");
        agentConfirmBox?.classList.remove("hidden");
        if(agentConfirmQuestion)agentConfirmQuestion.textContent=event.question||"This needs your decision.";
        if(agentResumeAnswer)agentResumeAnswer.value="";
        updateWorkflowRunStatus(runEntry,"needs_confirmation");
      },
      onApproval:(event)=>{
        if(agentLiveTitle)agentLiveTitle.textContent=`${preset.icon} ${preset.title} — approval needed`;
        agentConfirmBox?.classList.add("hidden");
        agentApprovalBox?.classList.remove("hidden");
        if(agentApprovalReason)agentApprovalReason.textContent=event.reason||"This step needs your go-ahead before it runs.";
        if(agentApprovalRisk)agentApprovalRisk.textContent=`${riskEmoji(event.riskLevel)} ${(event.riskLevel||"medium").toUpperCase()} RISK · ${agentStepLabel(event.action?.action)}`;
        updateWorkflowRunStatus(runEntry,"needs_approval");
      },
      onError:(event)=>{
        if(agentLiveTitle)agentLiveTitle.textContent=`${preset.icon} ${preset.title} — failed`;
        showToast(`⚠️ ${event.error||"Agent run failed"}`);
        updateWorkflowRunStatus(runEntry,"failed");
      }
    });
  }catch(error){
    if(agentLiveTitle)agentLiveTitle.textContent="🤖 Agent run failed";
    showToast(`⚠️ ${error?.message||"Agent run failed"}`);
    updateWorkflowRunStatus(runEntry,"failed");
  }
}

// Shared resume runner: reused by the ask_user answer form, the
// approve/deny buttons, and stale-run recovery — all three just
// stream against /api/agent with the current run's id and update
// the same live panel + Mission Control row.
async function streamAgentResume(payload,runEntry){
  const preset=WORKFLOW_PRESETS[runEntry?.kind]||WORKFLOW_PRESETS.research;
  try{
    await streamAgentRequest(payload,{
      onStep:(event)=>{agentApprovalBox?.classList.add("hidden");addAgentStepRow(event)},
      onFinal:(event)=>{
        if(agentLiveTitle)agentLiveTitle.textContent=`${preset.icon} ${preset.title} — done ✅`;
        agentApprovalBox?.classList.add("hidden");
        agentResultBox?.classList.remove("hidden");
        if(agentResultTitle)agentResultTitle.textContent=`✅ ${event.summary||"Done"}`;
        if(agentResultText)agentResultText.textContent=event.result||"";
        renderAgentHandoff(event.handoff);
        if(runEntry)updateWorkflowRunStatus(runEntry,"done",{result:event.result||""});
        loadFiles?.();
      },
      onConfirm:(event)=>{
        agentApprovalBox?.classList.add("hidden");
        agentConfirmBox?.classList.remove("hidden");
        if(agentConfirmQuestion)agentConfirmQuestion.textContent=event.question||"This needs your decision.";
        if(agentResumeAnswer)agentResumeAnswer.value="";
        if(runEntry)updateWorkflowRunStatus(runEntry,"needs_confirmation");
      },
      onApproval:(event)=>{
        agentConfirmBox?.classList.add("hidden");
        agentApprovalBox?.classList.remove("hidden");
        if(agentApprovalReason)agentApprovalReason.textContent=event.reason||"This step needs your go-ahead before it runs.";
        if(agentApprovalRisk)agentApprovalRisk.textContent=`${riskEmoji(event.riskLevel)} ${(event.riskLevel||"medium").toUpperCase()} RISK · ${agentStepLabel(event.action?.action)}`;
        if(runEntry)updateWorkflowRunStatus(runEntry,"needs_approval");
      },
      onError:(event)=>{
        showToast(`⚠️ ${event.error||"Agent run failed"}`);
        if(runEntry)updateWorkflowRunStatus(runEntry,"failed");
      }
    });
  }catch(error){
    showToast(`⚠️ ${error?.message||"Could not continue the run"}`);
  }
}

// Explicit-approval resume: user tapped Approve/Deny on a paused run.
async function sendAgentDecision(decision){
  if(!currentAgentRunId)return;
  const runEntry=getWorkflowRuns().find(r=>r.runId===currentAgentRunId);
  const preset=WORKFLOW_PRESETS[runEntry?.kind]||WORKFLOW_PRESETS.research;
  agentApprovalBox?.classList.add("hidden");
  if(agentLiveTitle)agentLiveTitle.textContent=`${preset.icon} ${preset.title} — ${decision==="approve"?"resuming…":"skipping that step…"}`;
  await streamAgentResume({runId:currentAgentRunId,decision},runEntry);
}
agentApproveBtn?.addEventListener("click",()=>sendAgentDecision("approve"));
agentDenyBtn?.addEventListener("click",()=>sendAgentDecision("deny"));

// Stale-run recovery: continues a run that got stuck (crashed
// invocation, dropped connection) from its last saved checkpoint,
// or re-surfaces the pending approval/question if that's what it
// was waiting on.
async function recoverAgentWorkflow(runEntry){
  const preset=WORKFLOW_PRESETS[runEntry.kind]||WORKFLOW_PRESETS.research;
  currentAgentRunId=runEntry.runId;
  switchTab("agents");
  agentLivePanel?.classList.remove("hidden");
  if(agentLiveTitle)agentLiveTitle.textContent=`${preset.icon} ${preset.title} — recovering…`;
  if(agentLiveGoal)agentLiveGoal.textContent=runEntry.brief||"";
  if(agentSteps)agentSteps.innerHTML="";
  agentResultBox?.classList.add("hidden");
  agentConfirmBox?.classList.add("hidden");
  agentApprovalBox?.classList.add("hidden");
  renderAgentHandoff(null);

  try{
    const response=await fetch("/api/agent",{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify({runId:runEntry.runId,resume:true})});
    const contentType=response.headers.get("content-type")||"";
    if(contentType.includes("application/x-ndjson")){
      const handle=(event)=>{
        if(event.type==="step"){agentApprovalBox?.classList.add("hidden");addAgentStepRow(event)}
        else if(event.type==="final"){
          if(agentLiveTitle)agentLiveTitle.textContent=`${preset.icon} ${preset.title} — done ✅`;
          agentResultBox?.classList.remove("hidden");
          if(agentResultTitle)agentResultTitle.textContent=`✅ ${event.summary||"Done"}`;
          if(agentResultText)agentResultText.textContent=event.result||"";
          renderAgentHandoff(event.handoff);
          updateWorkflowRunStatus(runEntry,"done",{result:event.result||""});
          loadFiles?.();
        }else if(event.type==="needs_confirmation"){
          agentConfirmBox?.classList.remove("hidden");
          if(agentConfirmQuestion)agentConfirmQuestion.textContent=event.question||"This needs your decision.";
          updateWorkflowRunStatus(runEntry,"needs_confirmation");
        }else if(event.type==="needs_approval"){
          agentApprovalBox?.classList.remove("hidden");
          if(agentApprovalReason)agentApprovalReason.textContent=event.reason||"This step needs your go-ahead before it runs.";
          if(agentApprovalRisk)agentApprovalRisk.textContent=`${riskEmoji(event.riskLevel)} ${(event.riskLevel||"medium").toUpperCase()} RISK · ${agentStepLabel(event.action?.action)}`;
          updateWorkflowRunStatus(runEntry,"needs_approval");
        }else if(event.type==="error"){
          showToast(`⚠️ ${event.error||"Agent run failed"}`);
          updateWorkflowRunStatus(runEntry,"failed");
        }
      };
      const reader=response.body?.getReader();
      if(reader){
        const decoder=new TextDecoder();let buffer="";
        while(true){
          const {value,done}=await reader.read();
          if(done)break;
          buffer+=decoder.decode(value,{stream:true});
          const lines=buffer.split("\n");buffer=lines.pop()||"";
          for(const line of lines){if(line.trim())try{handle(JSON.parse(line))}catch{}}
        }
        if(buffer.trim())try{handle(JSON.parse(buffer))}catch{}
      }
      return;
    }
    const data=await response.json().catch(()=>({}));
    if(data?.needsDecision&&data.run?.pendingAction){
      const p=data.run.pendingAction;
      updateWorkflowRunStatus(runEntry,"needs_approval");
      if(agentLiveTitle)agentLiveTitle.textContent=`${preset.icon} ${preset.title} — approval needed`;
      agentApprovalBox?.classList.remove("hidden");
      if(agentApprovalReason)agentApprovalReason.textContent=p.reason||"This step needs your go-ahead before it runs.";
      if(agentApprovalRisk)agentApprovalRisk.textContent=`${riskEmoji(p.riskLevel)} ${(p.riskLevel||"medium").toUpperCase()} RISK · ${agentStepLabel(p.action?.action)}`;
    }else if(data?.needsAnswer){
      updateWorkflowRunStatus(runEntry,"needs_confirmation");
      if(agentLiveTitle)agentLiveTitle.textContent=`${preset.icon} ${preset.title} — needs you`;
      agentConfirmBox?.classList.remove("hidden");
      if(agentConfirmQuestion)agentConfirmQuestion.textContent=data.run?.pendingAction?.question||"This needs your decision.";
      if(agentResumeAnswer)agentResumeAnswer.value="";
    }else if(!data?.ok){
      showToast(`⚠️ ${data?.error||"Could not recover that run"}`);
    }
  }catch(error){
    showToast(`⚠️ ${error?.message||"Could not recover that run"}`);
  }
}

agentResumeForm?.addEventListener("submit",async(e)=>{
  e.preventDefault();
  const answer=String(agentResumeAnswer?.value||"").trim();
  if(!answer||!currentAgentRunId)return;
  const submitBtn=agentResumeForm.querySelector("button[type=submit]");
  if(submitBtn)submitBtn.disabled=true;
  agentConfirmBox?.classList.add("hidden");
  if(agentLiveTitle)agentLiveTitle.textContent="🤖 Continuing…";
  const runEntry=getWorkflowRuns().find(r=>r.runId===currentAgentRunId);
  try{
    await streamAgentResume({runId:currentAgentRunId,answer},runEntry);
  }finally{
    if(submitBtn)submitBtn.disabled=false;
  }
});

function launchWorkflow(kind,promptOverride=""){
  const preset=getWorkflowMeta(kind);
  const seed=String(promptOverride||"").trim();
  if(!seed){openWorkflowModal(kind);return}
  const projectId=workflowProject?.value||projectSelect?.value||localStorage.getItem(STORAGE.projectId)||"";
  if(kind==="research"){searchOn=true;saveJSON(STORAGE.searchOn,true);updateSearchToggle()}
  runAgentWorkflow(kind,preset.prompt+seed,projectId);
}

agentLiveClose?.addEventListener("click",()=>{agentLivePanel?.classList.add("hidden");currentAgentRunId=null});
agentCopyResultBtn?.addEventListener("click",()=>copyText(agentResultText?.textContent||""));
agentSendToChatBtn?.addEventListener("click",()=>{switchTab("chat");userInput.value=agentResultText?.textContent?`Here's what the agent produced:\n\n${agentResultText.textContent}\n\nLet's refine it further.`:"";autoResize();userInput.focus()});
workflowForm?.addEventListener("submit",e=>{e.preventDefault();const kind=workflowModalOverlay?.dataset.kind||"research";const brief=String(workflowBrief?.value||"").trim();if(!brief)return showToast("⚠️ Add a brief first");launchWorkflow(kind,brief)});
workflowModalClose?.addEventListener("click",closeWorkflowModal);workflowCancelBtn?.addEventListener("click",closeWorkflowModal);workflowModalOverlay?.addEventListener("click",e=>{if(e.target===workflowModalOverlay)closeWorkflowModal()});

let currentResearchId=null;
let currentResearchSources=[];

researchForm?.addEventListener("submit",e=>{e.preventDefault();const q=String(researchPrompt?.value||"").trim();if(!q)return showToast("⚠️ Add a research question first");runResearchQuery(q)});
researchToChatBtn?.addEventListener("click",()=>{const q=String(researchPrompt?.value||"").trim();if(!q)return showToast("⚠️ Add a research question first");switchTab("chat");userInput.value=q;autoResize();userInput.focus()});
researchAsAgentBtn?.addEventListener("click",()=>{const q=String(researchPrompt?.value||"").trim();if(!q)return showToast("⚠️ Add a research question first");launchWorkflow("research",q)});

async function runResearchQuery(query,followUpOf){
  if(researchSubmitBtn){researchSubmitBtn.disabled=true;researchSubmitBtn.textContent="🔎 Researching…"}
  try{
    const projectId=activeProjectId();
    const r=await fetch(API_RESEARCH,{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify({query,projectId:projectId||undefined,followUpOf:followUpOf||undefined})});
    const d=await r.json();
    if(!d.ok){showToast(`⚠️ ${d.error||"Research failed"}`);return}
    currentResearchId=d.research.id;
    renderResearchResult(d.research);
    if(researchPrompt)researchPrompt.value="";
    loadResearchHistory();
  }catch(error){showToast(`⚠️ ${error?.message||"Research failed"}`)}
  finally{if(researchSubmitBtn){researchSubmitBtn.disabled=false;researchSubmitBtn.textContent="🔎 Start research"}}
}

function credBadge(level){return `<span class="credBadge ${level==="higher"?"higher":"general"}">${level==="higher"?"REFERENCE":"GENERAL"}</span>`}

function renderResearchResult(research){
  researchResultBox?.classList.remove("hidden");
  currentResearchSources=Array.isArray(research.sources)?research.sources:[];
  if(researchResultQuery)researchResultQuery.textContent=research.query;
  if(researchAnswerText)researchAnswerText.textContent=research.answer||"";
  if(researchSourcesList){
    const sources=currentResearchSources;
    researchSourcesList.innerHTML=sources.length?"":"<p class='emptyText'>No sources found.</p>";
    sources.forEach(s=>{
      const row=document.createElement("div");
      row.className="researchSource";
      row.innerHTML=`[${s.index}] <a href="${escapeHTML(s.url)}" target="_blank" rel="noopener">${escapeHTML(s.title)}</a>${credBadge(s.credibility)}<br><small>${escapeHTML(s.snippet||"")}</small>`;
      researchSourcesList.appendChild(row);
    });
  }
  if(researchFollowUpInput)researchFollowUpInput.value="";
  researchResultBox?.scrollIntoView({behavior:"smooth",block:"nearest"});
}

researchFollowUpForm?.addEventListener("submit",e=>{
  e.preventDefault();
  const q=String(researchFollowUpInput?.value||"").trim();
  if(!q||!currentResearchId)return;
  runResearchQuery(q,currentResearchId);
});

researchExportBtn?.addEventListener("click",()=>{
  if(!researchResultQuery||!researchAnswerText)return;
  const sources=Array.isArray(currentResearchSources)?currentResearchSources:[];
  const lines=[`# ${researchResultQuery.textContent}`,"",researchAnswerText.textContent,"","## Sources",...(sources.map(s=>`- [${s.index}] ${s.title} — ${s.url}`))];
  const blob=new Blob([lines.join("\n")],{type:"text/markdown"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=`research-${Date.now()}.md`;a.click();
  URL.revokeObjectURL(url);
});

async function loadResearchHistory(){
  if(!researchHistoryList)return;
  researchHistoryList.innerHTML='<p class="emptyText">Loading…</p>';
  const projectId=activeProjectId();
  try{
    const url=projectId?`${API_RESEARCH}?projectId=${encodeURIComponent(projectId)}`:API_RESEARCH;
    const r=await fetch(url,{headers:headers(),cache:"no-store"});
    const d=await r.json();
    const history=d.ok?d.history:[];
    researchHistoryList.innerHTML=history.length?"":"<p class='emptyText'>No research runs yet.</p>";
    history.forEach(h=>{
      const row=document.createElement("div");
      row.className="researchHistoryRow";
      row.innerHTML=`<div><strong>${escapeHTML(h.query)}</strong><small>${h.sourceCount} source(s) · ${new Date(h.updatedAt||h.createdAt).toLocaleString([],{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</small></div><button data-del>🗑️</button>`;
      row.addEventListener("click",async(e)=>{
        if(e.target.closest("[data-del]"))return;
        const rr=await fetch(`${API_RESEARCH}?id=${encodeURIComponent(h.id)}`,{headers:headers()});
        const dd=await rr.json();
        if(dd.ok){currentResearchId=dd.research.id;currentResearchSources=dd.research.sources||[];renderResearchResult(dd.research)}
      });
      row.querySelector("[data-del]").addEventListener("click",async(e)=>{
        e.stopPropagation();
        await fetch(`${API_RESEARCH}?id=${encodeURIComponent(h.id)}`,{method:"DELETE",headers:headers()});
        loadResearchHistory();
      });
      researchHistoryList.appendChild(row);
    });
  }catch{researchHistoryList.innerHTML='<p class="emptyText">⚠️ Could not load research history.</p>'}
}
agentGrid?.querySelectorAll("[data-agent]").forEach(btn=>btn.addEventListener("click",()=>launchWorkflow(btn.dataset.agent)));

clearWorkflowHistoryBtn?.addEventListener("click",()=>{saveJSON(STORAGE.workflowRuns,[]);renderMissionCenter();showToast("Workflow runs cleared")});
function openSidebar(){sidebar?.classList.add("open");sidebarOverlay?.classList.add("open")}function closeSidebar(){sidebar?.classList.remove("open");sidebarOverlay?.classList.remove("open")}
sidebarToggle?.addEventListener("click",()=>sidebar?.classList.contains("open")?closeSidebar():openSidebar());sidebarCloseBtn?.addEventListener("click",closeSidebar);sidebarOverlay?.addEventListener("click",closeSidebar);sidebarNewChatBtn?.addEventListener("click",()=>{startNewChat();switchTab("chat")});projectQuickBtn?.addEventListener("click",()=>switchTab("projects"));usageBtn?.addEventListener("click",()=>switchTab("memory"));

// 👑 Swipe-from-left to open the sidebar, swipe-left to close it —
// mobile-first, matches the ChatGPT-style edge-swipe drawer pattern.
// Edge zone kept narrow (24px) so it doesn't fight normal scrolling/
// swiping inside chat content; a real horizontal drag is required
// (small vertical drift is tolerated, a mostly-vertical gesture is
// ignored so it doesn't hijack page scroll).
(function(){
  const EDGE_ZONE=24, SWIPE_THRESHOLD=60, MAX_VERTICAL_DRIFT=60;
  let startX=0,startY=0,tracking=false,fromEdge=false;
  document.addEventListener("touchstart",(e)=>{
    if(e.touches.length!==1)return;
    startX=e.touches[0].clientX;startY=e.touches[0].clientY;
    fromEdge=!sidebar?.classList.contains("open")&&startX<=EDGE_ZONE;
    tracking=fromEdge||sidebar?.classList.contains("open");
  },{passive:true});
  document.addEventListener("touchend",(e)=>{
    if(!tracking)return;
    tracking=false;
    const touch=e.changedTouches[0];
    if(!touch)return;
    const dx=touch.clientX-startX, dy=Math.abs(touch.clientY-startY);
    if(dy>MAX_VERTICAL_DRIFT)return;
    if(fromEdge&&dx>SWIPE_THRESHOLD)openSidebar();
    else if(sidebar?.classList.contains("open")&&dx<-SWIPE_THRESHOLD)closeSidebar();
  },{passive:true});
})();

historySearchInput?.addEventListener("input",()=>{const q=historySearchInput.value.trim().toLowerCase();document.querySelectorAll("#historyList .historyItem").forEach(i=>i.style.display=!q||(i.dataset.searchText||"").includes(q)?"":"none")});

function addMessage(role,text,options={},index=null){if(!chatBox)return null;const auto=isNearBottom(),m=document.createElement("div");m.className=`message ${role}-message`;const msgIndex=index??(messages.length-1);m.dataset.msgIndex=String(msgIndex);const b=document.createElement("div");b.className="messageBubble";if(options.files?.length){options.files.forEach(n=>{const c=document.createElement("span");c.className="attachedFile";c.innerHTML=`📎 ${escapeHTML(n)}`;b.appendChild(c);b.appendChild(document.createElement("br"))})}if(options.usedSearch){const s=document.createElement("span");s.className="searchBadge";s.textContent="🔎 Live web search used";b.appendChild(s)}if(text){const c=document.createElement("div");c.className="messageContent";c.innerHTML=role==="assistant"?renderMarkdown(text):escapeHTML(text).replace(/\n/g,"<br>");b.appendChild(c);const a=document.createElement("div");a.className="messageActions";const copy=document.createElement("button");copy.textContent="📋 Copy";copy.onclick=()=>copyText(text);a.appendChild(copy);if(role==="assistant"){const r=document.createElement("button");r.textContent="🔄 Regenerate";r.onclick=()=>regenerateFrom(Number(m.dataset.msgIndex));a.appendChild(r)}else{const e=document.createElement("button");e.textContent="✏️ Edit";e.onclick=()=>startEditMessage(Number(m.dataset.msgIndex),text);a.appendChild(e)}b.appendChild(a)}m.appendChild(b);chatBox.appendChild(m);if(auto)scrollToBottom();return m}
function showWelcome(){chatBox.innerHTML=`<div class="welcomeScreen" aria-label="Kirong AI welcome"><div class="welcomeHalo" aria-hidden="true">✦</div><h1>Welcome, Boss 👑</h1></div>`}function renderMessages(){chatBox.innerHTML="";if(!messages.length){showWelcome();return}messages.forEach((m,i)=>addMessage(m.role,m.content,{files:m.files,usedSearch:m.usedSearch},i));scrollToBottom(true)}
const MODE_LABELS={content:{icon:"📝",label:"Content Factory"},whatsapp:{icon:"📱",label:"WhatsApp Business"},blog:{icon:"✍️",label:"Blog Engine"},affiliate:{icon:"🤝",label:"Affiliate Engine"},school:{icon:"🎓",label:"School Mode"}};
function setActiveMode(mode){activeMode=MODE_LABELS[mode]?mode:"chat";const info=MODE_LABELS[activeMode];if(!info){modeBanner.classList.add("hidden");modeBanner.innerHTML=""}else{modeBanner.classList.remove("hidden");modeBanner.innerHTML=`<span>${info.icon} ${escapeHTML(info.label)} active</span><button id="exitModeBtn">✕ Exit</button>`;document.getElementById("exitModeBtn")?.addEventListener("click",()=>setActiveMode("chat"))}switchTab("chat");userInput.focus()}
document.querySelectorAll(".toolCard[data-mode]").forEach(c=>c.addEventListener("click",()=>setActiveMode(c.dataset.mode)));

attachBtn?.addEventListener("click",()=>fileInput?.click());fileInput?.addEventListener("change",()=>{const incoming=Array.from(fileInput.files||[]),room=Math.max(0,3-selectedFiles.length);if(incoming.length>room)showToast(`⚠️ ${room} more file(s) allowed — max 3 per message`);selectedFiles=selectedFiles.concat(incoming.slice(0,room));fileInput.value="";renderFilePreview()});
function renderFilePreview(){if(!selectedFiles.length){filePreview.innerHTML="";filePreview.classList.add("hidden");return}filePreview.classList.remove("hidden");filePreview.innerHTML="";selectedFiles.forEach((f,i)=>{const c=document.createElement("span");c.className="fileChip";c.innerHTML=`📎 ${escapeHTML(f.name)} <button type="button">✕</button>`;c.querySelector("button").onclick=()=>{selectedFiles.splice(i,1);renderFilePreview()};filePreview.appendChild(c)})}

function saveCurrentChat(){if(!currentChatId){currentChatId=createChatId();localStorage.setItem(STORAGE.activeChat,currentChatId)}let chats=loadJSON(STORAGE.chats,[]);if(!Array.isArray(chats))chats=[];const first=messages.find(m=>m.role==="user"&&m.content),existing=chats.find(c=>c.id===currentChatId),data={id:currentChatId,title:createChatTitle(first?.content),projectId:projectSelect?.value||"",pinned:Boolean(existing?.pinned),archived:Boolean(existing?.archived),messages:messages.slice(-MAX_STORED_MESSAGES),updatedAt:Date.now()};const i=chats.findIndex(c=>c.id===currentChatId);if(i>=0)chats[i]=data;else chats.unshift(data);chats.sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));saveJSON(STORAGE.chats,chats.slice(0,MAX_STORED_CHATS));localStorage.setItem(STORAGE.activeChat,currentChatId);renderHistoryList();fetch(API_SYNC,{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify(data)}).catch(()=>{})}
async function syncRemote(){try{const r=await fetch(API_SYNC,{headers:headers(),cache:"no-store"});if(!r.ok)return;const d=await r.json();const remote=Array.isArray(d.chats)?d.chats:[];let local=loadJSON(STORAGE.chats,[]);if(!Array.isArray(local))local=[];const map=new Map(local.map(c=>[c.id,c]));remote.forEach(c=>{if(!map.has(c.id)||(c.updatedAt||0)>(map.get(c.id).updatedAt||0))map.set(c.id,c)});const merged=[...map.values()].sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).slice(0,MAX_STORED_CHATS);saveJSON(STORAGE.chats,merged);renderHistoryList()}catch{}}
function restoreChat(){const chats=loadJSON(STORAGE.chats,[]),active=localStorage.getItem(STORAGE.activeChat),c=Array.isArray(chats)?chats.find(x=>x.id===active):null;if(!c){currentChatId=createChatId();showWelcome();return}currentChatId=c.id;messages=Array.isArray(c.messages)?c.messages.slice(-MAX_STORED_MESSAGES):[];if(projectSelect)projectSelect.value=c.projectId||localStorage.getItem(STORAGE.projectId)||"";renderMessages()}
let showArchivedChats=false;
function toggleChatFlag(id,flag){const chats=loadJSON(STORAGE.chats,[]);if(!Array.isArray(chats))return;const c=chats.find(x=>x.id===id);if(!c)return;c[flag]=!c[flag];saveJSON(STORAGE.chats,chats);renderHistoryList();fetch(API_SYNC,{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify(c)}).catch(()=>{})}
function renameChat(id){
  const chats=loadJSON(STORAGE.chats,[]);
  if(!Array.isArray(chats))return;
  const c=chats.find(x=>x.id===id);
  if(!c)return;
  const next=prompt("Rename conversation",c.title||"New chat");
  if(next===null)return;
  c.title=next.trim().slice(0,120)||"New chat";
  c.updatedAt=Date.now();
  saveJSON(STORAGE.chats,chats);
  renderHistoryList();
  fetch(API_SYNC,{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify(c)}).catch(()=>{});
}
async function deleteChat(id){
  const chats=loadJSON(STORAGE.chats,[]);
  if(!Array.isArray(chats))return;
  const c=chats.find(x=>x.id===id);
  if(!confirm(`Delete "${c?.title||"this conversation"}"? This can't be undone.`))return;
  saveJSON(STORAGE.chats,chats.filter(x=>x.id!==id));
  try{await fetch(API_SYNC,{method:"DELETE",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify({id})})}catch{}
  if(id===currentChatId){
    messages=[];
    currentChatId=createChatId();
    localStorage.setItem(STORAGE.activeChat,currentChatId);
    showWelcome();
  }
  renderHistoryList();
  showToast("🗑️ Conversation deleted");
}
function renderHistoryList(){
  const targets=[historyList,sidebarHistoryList].filter(Boolean);
  let chats=loadJSON(STORAGE.chats,[]);
  if(!Array.isArray(chats))chats=[];
  const archivedCount=chats.filter(c=>c.archived).length;
  const visible=chats.filter(c=>showArchivedChats?true:!c.archived).sort((a,b)=>(Number(b.pinned)-Number(a.pinned))||((b.updatedAt||0)-(a.updatedAt||0)));
  targets.forEach(list=>{
    list.innerHTML=visible.length?"":"<p class='emptyText'>No conversations yet.</p>";
    visible.slice(0,30).forEach(c=>{
      const i=document.createElement("div");
      i.className="historyItem"+(c.id===currentChatId?" active":"")+(c.archived?" archived":"");
      i.dataset.searchText=(c.title||"").toLowerCase();
      i.innerHTML=`<div><b>${c.pinned?"📌 ":""}${escapeHTML(c.title||"New chat")}</b><small>${new Date(c.updatedAt||Date.now()).toLocaleDateString()}</small></div><span class="historyItemActions"><button type="button" data-pin title="${c.pinned?"Unpin":"Pin"}">${c.pinned?"📌":"📍"}</button><button type="button" data-archive title="${c.archived?"Unarchive":"Archive"}">${c.archived?"📤":"🗄️"}</button><button type="button" data-rename title="Rename">✏️</button><button type="button" data-delete title="Delete">🗑️</button></span>`;
      i.querySelector("div").onclick=()=>openChat(c.id);
      i.querySelector("[data-pin]").onclick=(e)=>{e.stopPropagation();toggleChatFlag(c.id,"pinned")};
      i.querySelector("[data-archive]").onclick=(e)=>{e.stopPropagation();toggleChatFlag(c.id,"archived")};
      i.querySelector("[data-rename]").onclick=(e)=>{e.stopPropagation();renameChat(c.id)};
      i.querySelector("[data-delete]").onclick=(e)=>{e.stopPropagation();deleteChat(c.id)};
      list.appendChild(i);
    });
  });
  if(historyArchiveToggle){
    historyArchiveToggle.textContent=showArchivedChats?`Hide archived (${archivedCount})`:`Show archived (${archivedCount})`;
    historyArchiveToggle.classList.toggle("hidden",archivedCount===0&&!showArchivedChats);
  }
}
function openChat(id){const c=(loadJSON(STORAGE.chats,[])||[]).find(x=>x.id===id);if(!c)return;currentChatId=c.id;localStorage.setItem(STORAGE.activeChat,id);messages=Array.isArray(c.messages)?c.messages.slice(-MAX_STORED_MESSAGES):[];if(projectSelect)projectSelect.value=c.projectId||"";renderMessages();renderHistoryList();switchTab("chat")}
function startNewChat(){if(messages.length)saveCurrentChat();messages=[];selectedFiles=[];setActiveMode("chat");currentChatId=createChatId();localStorage.setItem(STORAGE.activeChat,currentChatId);renderFilePreview();showWelcome();renderHistoryList()}
let editingIndex=null;
function regenerateFrom(index){
  const target=messages[index];
  if(!target||target.role!=="assistant")return;
  let userIdx=index-1;
  while(userIdx>=0&&messages[userIdx].role!=="user")userIdx--;
  if(userIdx<0)return showToast("Nothing to regenerate from");
  const userContent=messages[userIdx].content;
  messages=messages.slice(0,index);
  renderMessages();
  saveCurrentChat();
  sendMessage({silentUserMessage:true,overrideMessage:userContent});
}
function startEditMessage(index,text){
  const target=messages[index];
  if(!target||target.role!=="user")return;
  editingIndex=index;
  userInput.value=text;
  autoResize();
  userInput.focus();
  editBanner?.classList.remove("hidden");
}
function cancelEdit(){editingIndex=null;editBanner?.classList.add("hidden");userInput.value="";autoResize()}
editBannerCancelBtn?.addEventListener("click",cancelEdit);

function buildFormData(message,extra={}){const f=new FormData();f.append("message",message);f.append("mode",extra.mode||activeMode);f.append("userId",DEVICE_ID);f.append("projectId",projectSelect?.value||"");f.append("webSearch",String(searchOn));f.append("history",JSON.stringify(messages.filter(m=>m&&(m.role==="user"||m.role==="assistant")&&typeof m.content==="string").slice(-MAX_HISTORY_ITEMS).map(m=>({role:m.role,content:m.content}))));if(extra.generatorId)f.append("generatorId",extra.generatorId);if(extra.fields)f.append("fields",JSON.stringify(extra.fields));selectedFiles.forEach(file=>f.append("file",file,file.name));return f}
async function fetchWithTimeout(url,options={},timeout=REQUEST_TIMEOUT){activeAbortController=new AbortController();let timedOut=false;const timer=setTimeout(()=>{timedOut=true;activeAbortController.abort()},timeout);try{return await fetch(url,{...options,signal:activeAbortController.signal})}catch(e){if(e?.name==="AbortError"){if(timedOut)throw new Error("Request timed out. Please try again.");throw e}if(!navigator.onLine)throw new Error("You appear to be offline.");throw e}finally{clearTimeout(timer);activeAbortController=null}}
function setSendingState(on){isSending=Boolean(on);sendBtn.classList.toggle("stopping",isSending);sendBtn.innerHTML=isSending?'Stop <span>■</span>':'Send <span>↑</span>';userInput.disabled=isSending;attachBtn.disabled=isSending}
function stopGenerating(){if(!isSending||!activeAbortController)return;userStoppedGeneration=true;activeAbortController.abort()}
async function sendMessage(extra={}){if(isSending)return;userStoppedGeneration=false;const typed=String(userInput.value||"").trim();if(!typed&&!selectedFiles.length&&!extra.generatorId)return;if(!navigator.onLine)return showToast("🔴 You are offline");if(editingIndex!==null){messages=messages.slice(0,editingIndex);editingIndex=null;editBanner?.classList.add("hidden");renderMessages()}const names=selectedFiles.map(f=>f.name),visible=typed||(names.length?`Please analyze: ${names.join(", ")}`:"Generate this document");if(!currentChatId){currentChatId=createChatId();localStorage.setItem(STORAGE.activeChat,currentChatId)}chatBox.querySelector(".welcomeCard")?.remove();if(!extra.silentUserMessage){addMessage("user",visible,names.length?{files:names}:{});messages.push({role:"user",content:visible,files:names,timestamp:Date.now()})}userInput.value="";autoResize();setSendingState(true);thinking.classList.remove("hidden");
try{const response=await fetchWithTimeout(API_CHAT,{method:"POST",body:buildFormData(extra.overrideMessage||typed||visible,extra),headers:headers({Accept:"application/x-ndjson, application/json"}),cache:"no-store"});if(!response.ok&&!response.body?.getReader){const d=await response.json().catch(()=>({}));const err=new Error(d.error||`Server error ${response.status}`);err.code=d.code;throw err}let accumulated="",saw=false,errorMessage=null,doneMeta=null,live=null,liveContent=null;const ensure=()=>{if(live)return;live=addMessage("assistant","");liveContent=live?.querySelector(".messageContent")};const handle=e=>{if(e?.type==="chunk"){saw=true;accumulated+=e.text||"";ensure();if(liveContent)liveContent.innerHTML=renderMarkdown(accumulated);scrollToBottom()}else if(e?.type==="done"){doneMeta=e;if(e.usage)updateUsageBar(e.usage)}else if(e?.type==="error")errorMessage=e.error||"Kirong AI failed."};const reader=response.body?.getReader();if(reader){const decoder=new TextDecoder();let buffer="";while(true){const {value,done}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});const lines=buffer.split("\n");buffer=lines.pop()||"";for(const line of lines){if(line.trim())try{handle(JSON.parse(line))}catch{}}}if(buffer.trim())try{handle(JSON.parse(buffer))}catch{}}
if(userStoppedGeneration&&saw){accumulated+="\n\n⏹️ *(stopped)*";liveContent.innerHTML=renderMarkdown(accumulated)}else if(userStoppedGeneration&&!saw)live?.remove();else if(errorMessage&&!saw){live?.remove();throw new Error(errorMessage)}else if(errorMessage&&saw)accumulated+="\n\n⚠️ *(connection dropped — reply may be incomplete)*";if(saw){live?.remove();addMessage("assistant",accumulated||"No response received.",{usedSearch:Boolean(doneMeta?.usedSearch)});messages.push({role:"assistant",content:accumulated||"No response received.",usedSearch:Boolean(doneMeta?.usedSearch),timestamp:Date.now()})}selectedFiles=[];renderFilePreview();saveCurrentChat();refreshUserProfile()}catch(e){if(userStoppedGeneration&&e?.name==="AbortError")return;if(["MESSAGE_LIMIT","IMAGE_LIMIT","FILE_LIMIT","FILE_MESSAGE_LIMIT"].includes(e?.code)){openProModal(e.code==="IMAGE_LIMIT"?"You've used your 3 free images. Wait 6 hours or upgrade to Pro.":e.code==="FILE_LIMIT"?"You've used your 5 free file uploads. Wait 6 hours or upgrade to Pro.":e.code==="FILE_MESSAGE_LIMIT"?"Free allows up to 3 files in one message.":"You've used your 20 free messages. Wait 6 hours or upgrade to Pro.");return}if(e?.code==="PRO_FEATURE"){openProModal("That's a Pro feature — upgrade to unlock it.");return}const msg=String(e?.message||"Connection error");addMessage("assistant",`⚠️ ${msg}`);messages.push({role:"assistant",content:`Error: ${msg}`,timestamp:Date.now()});saveCurrentChat()}finally{thinking.classList.add("hidden");setSendingState(false);userInput.focus()}}
composer?.addEventListener("submit",e=>{e.preventDefault();isSending?stopGenerating():sendMessage()});

function updateUsageBar(usage){const u=usage?.messages,limit=Number(u?.limit);if(!u||!Number.isFinite(limit)||limit<=0){usageBarWrap.classList.add("hidden");return}const used=Number(u.used)||0,pct=Math.min(100,Math.round((used/limit)*100));usageBarWrap.classList.remove("hidden");usageBarFill.style.width=pct+"%";usageBarFill.classList.toggle("warn",pct>=70&&pct<100);usageBarFill.classList.toggle("full",pct>=100);const resetAt=Number(usage?.resetAt)||0;let reset="";if(resetAt&&resetAt>Date.now()){const mins=Math.ceil((resetAt-Date.now())/60000);reset=mins>=60?` · resets in ${Math.ceil(mins/60)}h`:` · resets in ${mins}m`}usageBarPercent.textContent=`${used}/${limit}${reset}`}
function updatePlanBadge(plan){planBadgeLabel.textContent=plan==="pro"?"Pro workspace":"Free workspace";planBadgeSub.textContent=plan==="pro"?"Royal mode enabled":"20 msgs · 3 images · 5 files / 6h";planBadgeBox.classList.toggle("pro",plan==="pro")}
// ---- Accounts (optional sign-in; guest workspace still works without one) ----
let currentAccount=null, authMode="login";

function renderAccountBadge(){
  if(!accountBadgeBtn)return;
  if(currentAccount){
    const label=currentAccount.name||currentAccount.email;
    accountAvatar.textContent=String(label).trim().charAt(0).toUpperCase()||"👤";
    accountAvatar.classList.add("isSignedIn");
    accountBadgeLabel.textContent=label;
    accountBadgeSub.textContent="Synced across your devices";
  }else{
    accountAvatar.textContent="👤";
    accountAvatar.classList.remove("isSignedIn");
    accountBadgeLabel.textContent="Guest workspace";
    accountBadgeSub.textContent="Sign in to sync across devices";
  }
}

function setAuthMode(mode){
  authMode=mode==="signup"?"signup":"login";
  const signup=authMode==="signup";
  authModalTitle.textContent=signup?"Create account":"Sign in";
  authModalSub.textContent=signup
    ? "One account keeps your chats, projects, files and memory with you on any device."
    : "Sign in to reach this workspace — chats, projects, files and memory — from any device.";
  authSubmitBtn.textContent=signup?"Create account":"Sign in";
  authSwitchBtn.textContent=signup?"I already have an account":"Create an account";
  authName.classList.toggle("hidden",!signup);
  authSignupHint.classList.toggle("hidden",!signup);
  authPassword.setAttribute("autocomplete",signup?"new-password":"current-password");
  showAuthError("");
}

function showAuthError(message){
  if(!authError)return;
  authError.textContent=String(message||"");
  authError.classList.toggle("hidden",!message);
}

function openAuthModal(){
  if(!authModalOverlay)return;
  const signedIn=Boolean(currentAccount);
  authSignedIn.classList.toggle("hidden",!signedIn);
  authSignedOut.classList.toggle("hidden",signedIn);
  if(signedIn){
    authAccountEmail.textContent=currentAccount.email;
  }else{
    setAuthMode("login");
    authForm.reset();
  }
  authModalOverlay.classList.remove("hidden");
  if(!signedIn)setTimeout(()=>authEmail?.focus(),50);
}
function closeAuthModal(){authModalOverlay?.classList.add("hidden")}

accountBadgeBtn?.addEventListener("click",openAuthModal);
authModalClose?.addEventListener("click",closeAuthModal);
authModalOverlay?.addEventListener("click",e=>{if(e.target===authModalOverlay)closeAuthModal()});
authSwitchBtn?.addEventListener("click",()=>setAuthMode(authMode==="signup"?"login":"signup"));

authForm?.addEventListener("submit",async(e)=>{
  e.preventDefault();
  showAuthError("");
  authSubmitBtn.disabled=true;
  const wasSignup=authMode==="signup";
  try{
    const payload={email:authEmail.value.trim(),password:authPassword.value,deviceId:DEVICE_ID};
    if(wasSignup&&authName.value.trim())payload.name=authName.value.trim();
    const r=await fetch(`${API_AUTH}?action=${wasSignup?"signup":"login"}`,{
      method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify(payload)
    });
    const d=await r.json();
    if(!d.ok)throw new Error(d.error||"Something went wrong.");
    if(d.token)setSessionToken(d.token);
    currentAccount=d.account;
    renderAccountBadge();
    closeAuthModal();
    showToast(wasSignup?"✅ Account created":"✅ Signed in");
    // The identity the server reads/writes as may have changed, so
    // pull the workspace fresh rather than trusting what's on screen.
    await reloadWorkspaceForIdentity();
  }catch(error){
    showAuthError(error?.message||"Something went wrong.");
  }finally{
    authSubmitBtn.disabled=false;
  }
});

authSignOutBtn?.addEventListener("click",async()=>{
  try{await fetch(`${API_AUTH}?action=logout`,{method:"POST",headers:headers()})}catch{}
  setSessionToken("");
  currentAccount=null;
  renderAccountBadge();
  closeAuthModal();
  showToast("Signed out");
  await reloadWorkspaceForIdentity();
});

// Everything that is keyed to the server-side identity has to be
// re-fetched when that identity changes (sign in / sign out), or the
// UI keeps showing the previous identity's data until a reload.
async function reloadWorkspaceForIdentity(){
  currentChatId=null;
  messages=[];
  // The local chat cache is NOT namespaced by identity, and
  // syncRemote() merges remote into local rather than replacing it.
  // Without clearing it here, the previous identity's chats would be
  // merged into — and then uploaded to — the new one. Clearing is
  // safe: anything that mattered was already synced to the server
  // under its own identity and comes back on next sign-in.
  try{
    localStorage.removeItem(STORAGE.chats);
    localStorage.removeItem(STORAGE.activeChat);
    localStorage.removeItem(STORAGE.projectId);
  }catch{}
  if(projectSelect)projectSelect.value="";
  chatBox.innerHTML="";
  renderMessages();
  renderHistoryList();
  await Promise.allSettled([
    refreshUserProfile(),
    refreshAccount(),
    loadProjects(),
    loadFiles(),
    syncRemote()
  ]);
}

async function refreshAccount(){
  try{
    const r=await fetch(`${API_AUTH}?action=me`,{headers:headers(),cache:"no-store"});
    if(!r.ok)return;
    const d=await r.json();
    if(!d.ok)return;
    currentAccount=d.account;
    // A session that the server no longer recognizes is dead weight —
    // drop the local copy so we stop sending it.
    if(!d.account&&getSessionToken())setSessionToken("");
    renderAccountBadge();
  }catch{}
}

async function refreshUserProfile(){try{const r=await fetch(API_USER,{headers:headers(),cache:"no-store"});if(!r.ok)return;const d=await r.json();if(d.ok){updatePlanBadge(d.plan);updateUsageBar(d.usage)}}catch{}}

// ============================================================
// 👑 PRO UPGRADE (M-Pesa)
// ============================================================
const proModalOverlay=document.getElementById("proModalOverlay"), proModalReason=document.getElementById("proModalReason"), proPhoneInput=document.getElementById("proPhoneInput"), proPayBtn=document.getElementById("proPayBtn"), proPayStatus=document.getElementById("proPayStatus"), proModalClose=document.getElementById("proModalClose");
let proPollTimer=null;

function openProModal(reason){
  proModalOverlay?.classList.remove("hidden");
  if(proModalReason)proModalReason.textContent=reason||"Unlock higher daily limits, Pro-only tools, and priority AI providers.";
  if(proPayStatus){proPayStatus.textContent="";proPayStatus.className="proPayStatus"}
  if(proPayBtn){proPayBtn.disabled=false;proPayBtn.textContent="📲 Pay with M-Pesa"}
  setTimeout(()=>proPhoneInput?.focus(),40);
}
function closeProModal(){proModalOverlay?.classList.add("hidden");clearTimeout(proPollTimer)}
planBadgeBox?.addEventListener("click",()=>{if(!planBadgeBox.classList.contains("pro"))openProModal()});
proModalClose?.addEventListener("click",closeProModal);
document.getElementById("proModalCancelBtn")?.addEventListener("click",e=>{e.preventDefault();closeProModal()});
proModalOverlay?.addEventListener("click",e=>{if(e.target===proModalOverlay)closeProModal()});

async function pollPaymentStatus(checkoutRequestId,attemptsLeft=20){
  if(attemptsLeft<=0){
    if(proPayStatus){proPayStatus.textContent="⏱️ Still waiting on M-Pesa — if you approved it, this can take a minute. You can close this and check back.";proPayStatus.className="proPayStatus pending"}
    if(proPayBtn){proPayBtn.disabled=false;proPayBtn.textContent="📲 Pay with M-Pesa"}
    return;
  }
  try{
    const r=await fetch(`${API_PAYMENT_STATUS}&checkoutRequestId=${encodeURIComponent(checkoutRequestId)}`,{headers:headers(),cache:"no-store"});
    const d=await r.json();
    if(d.ok&&d.status==="completed"){
      if(proPayStatus){proPayStatus.textContent="✅ Payment received — you're Pro now!";proPayStatus.className="proPayStatus success"}
      await refreshUserProfile();
      setTimeout(closeProModal,1800);
      return;
    }
    if(d.ok&&d.status==="failed"){
      if(proPayStatus){proPayStatus.textContent=`⚠️ Payment ${d.failureReason?`failed: ${d.failureReason}`:"was not completed."}`;proPayStatus.className="proPayStatus failed"}
      if(proPayBtn){proPayBtn.disabled=false;proPayBtn.textContent="📲 Try again"}
      return;
    }
  }catch{}
  proPollTimer=setTimeout(()=>pollPaymentStatus(checkoutRequestId,attemptsLeft-1),3000);
}

document.getElementById("proPayForm")?.addEventListener("submit",async e=>{
  e.preventDefault();
  const phone=String(proPhoneInput?.value||"").trim();
  if(!phone)return showToast("⚠️ Enter your Safaricom number");
  proPayBtn.disabled=true;proPayBtn.textContent="Sending request…";
  if(proPayStatus){proPayStatus.textContent="📲 Sending payment request…";proPayStatus.className="proPayStatus pending"}
  try{
    const r=await fetch(API_PAYMENT,{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify({phone})});
    const d=await r.json();
    if(!r.ok||!d.ok)throw new Error(d.error||"Could not start payment.");
    if(proPayStatus)proPayStatus.textContent="📱 Check your phone and enter your M-Pesa PIN…";
    proPayBtn.textContent="Waiting for confirmation…";
    pollPaymentStatus(d.checkoutRequestId);
  }catch(error){
    if(proPayStatus){proPayStatus.textContent=`⚠️ ${error?.message||"Could not start payment."}`;proPayStatus.className="proPayStatus failed"}
    proPayBtn.disabled=false;proPayBtn.textContent="📲 Pay with M-Pesa";
  }
});


function openImageStudio(){
  imageResult?.classList.add("hidden");
  if(imageResult) imageResult.innerHTML="";
  imageModalOverlay?.classList.remove("hidden");
  setTimeout(()=>imagePrompt?.focus(),40);
}
function closeImageStudio(){
  imageModalOverlay?.classList.add("hidden");
}
imageStudioBtn?.addEventListener("click",openImageStudio);
imageModalClose?.addEventListener("click",closeImageStudio);
imageCancelBtn?.addEventListener("click",closeImageStudio);
imageModalOverlay?.addEventListener("click",e=>{if(e.target===imageModalOverlay)closeImageStudio()});

function saveImageToGallery(data,prompt,aspectRatio){
  const url=String(data.imageUrl||"");
  if(!/^https?:\/\//i.test(url)&&!/^data:image\//i.test(url))return;
  const gallery=loadJSON(STORAGE.imageGallery,[]).filter(x=>x&&x.url);
  gallery.unshift({url,prompt,aspectRatio,model:data.model||"Kirong Image Engine",fileId:data.savedFile?.id||null,fileName:data.savedFile?.name||null,createdAt:Date.now()});
  saveJSON(STORAGE.imageGallery,gallery.slice(0,12));
  renderImageGallery();
}
async function downloadImageUrl(url,filename){
  try{
    if(/^data:/i.test(url)){
      const a=document.createElement("a");a.href=url;a.download=filename||"kirong-image.png";document.body.appendChild(a);a.click();a.remove();
      return;
    }
    const res=await fetch(url);const blob=await res.blob();
    const objUrl=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=objUrl;a.download=filename||"kirong-image.png";document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(objUrl),4000);
  }catch{showToast("⚠️ Could not download image")}
}
function renderImageGallery(){
  if(!imageGalleryGrid)return;
  const gallery=loadJSON(STORAGE.imageGallery,[]).filter(x=>x&&x.url).slice(0,12);
  if(!gallery.length){imageGalleryGrid.innerHTML='<p class="emptyText">No saved creations yet. Generate an image to start your shelf.</p>';return}
  imageGalleryGrid.innerHTML=gallery.map((item,i)=>`<article class="galleryCard"><a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHTML(item.url)}" alt="${escapeHTML(item.prompt||"Kirong creation")}" loading="lazy"></a><div class="galleryCardBody"><strong>${escapeHTML(item.aspectRatio||"1:1")}</strong><small>${new Date(item.createdAt||Date.now()).toLocaleDateString()}</small><p>${escapeHTML(item.prompt||"")}</p><button type="button" class="secondaryBtn" data-gallery-use="${i}">Use in chat</button><div class="galleryCardActions"><button type="button" data-gallery-download="${i}">⬇️ Save</button><button type="button" data-gallery-delete="${i}">🗑️</button></div></div></article>`).join("");
  imageGalleryGrid.querySelectorAll("[data-gallery-use]").forEach(btn=>btn.addEventListener("click",()=>{const item=gallery[Number(btn.dataset.galleryUse)];if(!item)return;switchTab("chat");userInput.value=`Help me use this Kirong image in the current project. Image URL: ${item.url}`;autoResize();userInput.focus()}));
  imageGalleryGrid.querySelectorAll("[data-gallery-download]").forEach(btn=>btn.addEventListener("click",()=>{const item=gallery[Number(btn.dataset.galleryDownload)];if(item)downloadImageUrl(item.url,item.fileName||`kirong-image-${Date.now()}.png`)}));
  imageGalleryGrid.querySelectorAll("[data-gallery-delete]").forEach(btn=>btn.addEventListener("click",()=>{const idx=Number(btn.dataset.galleryDelete);const all=loadJSON(STORAGE.imageGallery,[]).filter(x=>x&&x.url);all.splice(idx,1);saveJSON(STORAGE.imageGallery,all);renderImageGallery();showToast("🗑️ Removed from shelf")}));
}
clearImageGalleryBtn?.addEventListener("click",()=>{if(!confirm("Clear your local Image Studio shelf?"))return;saveJSON(STORAGE.imageGallery,[]);renderImageGallery();showToast("🖼️ Shelf cleared")});


function showGeneratedImage(data){
  if(!imageResult)return;
  imageResult.classList.remove("hidden");
  const savedNote=data.savedFile?`<span class="savedBadge">💾 Saved to Files</span>`:"";
  imageResult.innerHTML=`<div class="generatedImageCard">
    <img src="${escapeHTML(data.imageUrl)}" alt="Generated by Kirong AI" loading="eager" />
    <div class="generatedImageMeta">
      <span>👑 Kirong Image Studio · ${escapeHTML(data.model||"Kirong Image Engine")} ${savedNote}</span>
      <div class="imageActions">
        <button type="button" class="secondaryBtn" id="downloadImageBtn">⬇️ Download</button>
        <button type="button" class="secondaryBtn" id="useImageInChatBtn">Use in chat</button>
      </div>
    </div>
  </div>`;
  document.getElementById("downloadImageBtn")?.addEventListener("click",()=>downloadImageUrl(data.imageUrl,data.savedFile?.name||`kirong-image-${Date.now()}.png`));
  document.getElementById("useImageInChatBtn")?.addEventListener("click",()=>{closeImageStudio();switchTab("chat");userInput.value="Help me use this generated image in the current project. Describe how I can improve, caption, position or repurpose it.";autoResize();userInput.focus()});
}

imageForm?.addEventListener("submit",async e=>{
  e.preventDefault();
  const prompt=String(imagePrompt?.value||"").trim();
  if(!prompt)return;
  imageGenerateBtn.disabled=true;
  imageGenerateBtn.textContent="Creating…";
  imageResult?.classList.remove("hidden");
  if(imageResult) imageResult.innerHTML='<div class="imageProgress">⏳ Starting image generation…</div>';
  try{
    const response=await fetch(API_IMAGE,{
      method:"POST",
      headers:headers({"Content-Type":"application/json"}),
      body:JSON.stringify({
        prompt,
        aspect_ratio:imageAspectRatio?.value||"1:1"
      }),
      cache:"no-store"
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok||!data.ok)throw new Error(data.error||`Image server error ${response.status}`);
    if(data.imageUrl){
      saveImageToGallery(data,prompt,imageAspectRatio?.value||"1:1");
      showGeneratedImage(data);
    }else{
      throw new Error("Kirong returned no usable image.");
    }
  }catch(error){
    if(imageResult){
      imageResult.classList.remove("hidden");
      imageResult.innerHTML=`<div class="imageError">⚠️ ${escapeHTML(error?.message||"Image generation failed.")}</div>`;
    }
  }finally{
    imageGenerateBtn.disabled=false;
    imageGenerateBtn.textContent="✨ Generate image";
  }
});

async function loadGenerators(){try{const r=await fetch(API_GENERATORS);const d=await r.json();generators=d.ok?d.generators:[]}catch{generators=[]}renderGeneratorGrid()}
function renderGeneratorGrid(){if(!generators.length){generatorGrid.innerHTML='<p class="emptyText">Tools unavailable right now.</p>';return}generatorGrid.innerHTML="";generators.forEach(g=>{const c=document.createElement("button");c.className="toolCard";c.innerHTML=`<span>${g.icon}</span><strong>${escapeHTML(g.label)}</strong><small>Generate polished work</small>`;c.onclick=()=>openGeneratorModal(g);generatorGrid.appendChild(c)})}
function openGeneratorModal(g){generatorModalBox.innerHTML=`<button class="iconBtn modalClose" id="generatorClose">✕</button><h3>${g.icon} ${escapeHTML(g.label)}</h3><p class="modalHint">Fill in what you know — Kirong will handle the structure and polish.</p><form id="generatorForm">${g.fields.map(f=>`<div class="modalField"><label>${escapeHTML(f.label)}${f.required?" *":""}</label>${f.type==="textarea"?`<textarea id="gen_${f.key}" ${f.required?"required":""}></textarea>`:`<input id="gen_${f.key}" ${f.required?"required":""} />`}</div>`).join("")}<div class="modalActions"><button type="button" id="generatorCancel">Cancel</button><button class="primaryBtn" type="submit">✨ Generate</button></div></form>`;generatorModalOverlay.classList.remove("hidden");document.getElementById("generatorClose").onclick=closeGeneratorModal;document.getElementById("generatorCancel").onclick=closeGeneratorModal;document.getElementById("generatorForm").onsubmit=e=>{e.preventDefault();const fields={};let missing=false;g.fields.forEach(f=>{const v=document.getElementById(`gen_${f.key}`).value.trim();if(f.required&&!v)missing=true;fields[f.key]=v});if(missing)return showToast("⚠️ Fill the required fields");closeGeneratorModal();switchTab("chat");sendMessage({generatorId:g.id,fields,silentUserMessage:false,overrideMessage:`Generate ${g.label}`})}}
function closeGeneratorModal(){generatorModalOverlay.classList.add("hidden");generatorModalBox.innerHTML=""}generatorModalOverlay?.addEventListener("click",e=>{if(e.target===generatorModalOverlay)closeGeneratorModal()});

async function loadProjects(){try{const r=await fetch(API_PROJECTS,{headers:headers(),cache:"no-store"});const d=await r.json();projects=d.ok?d.projects:[]}catch{projects=[]}renderProjects();renderProjectSelect();renderMissionCenter()}
function renderProjectSelect(){if(!projectSelect)return;const current=projectSelect.value||localStorage.getItem(STORAGE.projectId)||"";projectSelect.innerHTML='<option value="">No project</option>'+projects.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)}</option>`).join("");projectSelect.value=projects.some(p=>p.id===current)?current:"";if(projectSelect.value)localStorage.setItem(STORAGE.projectId,projectSelect.value)}
function renderProjects(){if(!projectGrid)return;if(!projects.length){projectGrid.innerHTML='<div class="emptyState"><div>📁</div><h3>No projects yet</h3><p>Create your first workspace and give Kirong instructions for it.</p><button class="primaryBtn" id="emptyNewProject">Create project</button></div>';document.getElementById("emptyNewProject")?.addEventListener("click",openProjectModal);return}projectGrid.innerHTML="";projects.forEach(p=>{const c=document.createElement("div");c.className="projectCard";c.innerHTML=`<div class="projectIcon">📁</div><div class="projectCardBody"><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description||"No description")}</p><small>${new Date(p.updatedAt||Date.now()).toLocaleDateString()}</small></div><div class="projectCardActions"><button class="primaryBtn" data-use>Open</button><button class="dangerIcon" data-delete>🗑️</button></div>`;c.querySelector("[data-use]").onclick=()=>{projectSelect.value=p.id;localStorage.setItem(STORAGE.projectId,p.id);switchTab("chat");showToast(`📁 ${p.name} active`)};c.querySelector("[data-delete]").onclick=async()=>{if(!confirm(`Delete ${p.name}?`))return;await fetch(`${API_PROJECTS}?id=${encodeURIComponent(p.id)}`,{method:"DELETE",headers:headers()});if(projectSelect.value===p.id)projectSelect.value="";await loadProjects();showToast("Project deleted")};projectGrid.appendChild(c)})}
function openProjectModal(){projectForm.reset();projectModalOverlay.classList.remove("hidden");setTimeout(()=>projectName.focus(),0)}function closeProjectModal(){projectModalOverlay.classList.add("hidden")}newProjectBtn?.addEventListener("click",openProjectModal);projectModalClose?.addEventListener("click",closeProjectModal);projectCancelBtn?.addEventListener("click",closeProjectModal);projectModalOverlay?.addEventListener("click",e=>{if(e.target===projectModalOverlay)closeProjectModal()});projectForm?.addEventListener("submit",async e=>{e.preventDefault();const r=await fetch(API_PROJECTS,{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify({name:projectName.value,description:projectDescription.value,instructions:projectInstructions.value})});const d=await r.json().catch(()=>({}));if(!r.ok||!d.ok)return showToast("⚠️ Could not create project");closeProjectModal();await loadProjects();projectSelect.value=d.project.id;localStorage.setItem(STORAGE.projectId,d.project.id);switchTab("chat");showToast("📁 Project created")});projectSelect?.addEventListener("change",()=>{localStorage.setItem(STORAGE.projectId,projectSelect.value||"");if(currentChatId)saveCurrentChat();loadProjectMemoryPanel();loadProjectPermissionsPanel();loadFiles()});

async function loadMemoryPanel(){memoryProfile.innerHTML='<p class="emptyText">Loading…</p>';memoryFacts.innerHTML="";loadMemoryInsight();try{const r=await fetch(API_MEMORY,{headers:headers(),cache:"no-store"}),d=await r.json();if(!d.ok)throw new Error();renderMemoryPanel(d.memory)}catch{memoryProfile.innerHTML='<p class="emptyText">⚠️ Could not load memory right now.</p>'}loadProjectMemoryPanel();loadProjectPermissionsPanel()}
function activeProjectId(){return projectSelect?.value||localStorage.getItem(STORAGE.projectId)||""}
async function loadProjectMemoryPanel(){
  const projectId=activeProjectId();
  if(!projectId||!projectMemorySection){projectMemorySection?.classList.add("hidden");return}
  const project=projects.find(p=>p.id===projectId);
  if(projectMemoryName)projectMemoryName.textContent=project?.name||"this project";
  projectMemorySection.classList.remove("hidden");
  projectMemoryFacts.innerHTML='<p class="emptyText">Loading…</p>';
  try{
    const r=await fetch(`${API_PROJECT_MEMORY}&projectId=${encodeURIComponent(projectId)}`,{headers:headers(),cache:"no-store"});
    const d=await r.json();
    if(!d.ok)throw new Error();
    renderProjectMemoryPanel(projectId,d.memory);
  }catch{projectMemoryFacts.innerHTML='<p class="emptyText">⚠️ Could not load project memory right now.</p>'}
}
function renderProjectMemoryPanel(projectId,memory){
  const facts=Array.isArray(memory?.facts)?[...memory.facts].sort((a,b)=>(b.pinned-a.pinned)||(b.savedAt-a.savedAt)):[];
  projectMemoryFacts.innerHTML=facts.length?"":"<p class='emptyText'>Nothing yet — save a fact above, or just tell Kirong “remember that…” while this project is open.</p>";
  facts.forEach(f=>{
    const row=document.createElement("div");
    row.className="memoryFactRow projectMemoryFactRow";
    row.innerHTML=`<span>${f.pinned?"📌 ":""}${escapeHTML(f.text)}</span><span class="projectMemoryFactActions"><button data-pin title="${f.pinned?"Unpin":"Pin"}">${f.pinned?"📌":"📍"}</button><button data-del title="Forget">🗑️</button></span>`;
    row.querySelector("[data-pin]").onclick=async()=>{
      const r=await fetch(`${API_PROJECT_MEMORY}&projectId=${encodeURIComponent(projectId)}`,{method:"PUT",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify({factId:f.id,pinned:!f.pinned})});
      const d=await r.json();if(d.ok)renderProjectMemoryPanel(projectId,d.memory)
    };
    row.querySelector("[data-del]").onclick=async()=>{
      const r=await fetch(`${API_PROJECT_MEMORY}&projectId=${encodeURIComponent(projectId)}&factId=${encodeURIComponent(f.id)}`,{method:"DELETE",headers:headers()});
      const d=await r.json();if(d.ok){renderProjectMemoryPanel(projectId,d.memory);showToast("Forgotten")}
    };
    projectMemoryFacts.appendChild(row);
  });
}
projectMemoryForm?.addEventListener("submit",async e=>{
  e.preventDefault();
  const text=String(projectMemoryInput?.value||"").trim();
  const projectId=activeProjectId();
  if(!text||!projectId)return;
  const r=await fetch(`${API_PROJECT_MEMORY}&projectId=${encodeURIComponent(projectId)}`,{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify({text,category:"context"})});
  const d=await r.json();
  if(d.ok){projectMemoryInput.value="";renderProjectMemoryPanel(projectId,d.memory)}else showToast("⚠️ Could not save that");
});
forgetProjectMemoryBtn?.addEventListener("click",async()=>{
  const projectId=activeProjectId();
  if(!projectId)return;
  const project=projects.find(p=>p.id===projectId);
  if(!confirm(`Forget everything Kirong remembers about ${project?.name||"this project"}?`))return;
  const r=await fetch(`${API_PROJECT_MEMORY}&projectId=${encodeURIComponent(projectId)}&all=true`,{method:"DELETE",headers:headers()});
  const d=await r.json();
  if(d.ok){renderProjectMemoryPanel(projectId,d.memory);showToast("🗑️ Project memory cleared")}
});

// ---- Phase 4a: per-project agent permissions ----
// Friendly labels for the fine-grained action names risk-policy.js
// classifies — falls back to the raw name for anything not listed
// here (keeps this forward-compatible if a new tool is added
// server-side before this map is updated).
const PERMISSION_LABELS={
  web_search:"Web search",deep_research:"Deep research",generate_image:"Generate image",
  write_file:"Write a file",read_file:"Read a file",update_project:"Update project details",
  draft_whatsapp:"Draft WhatsApp message",workspace_write:"Write scratch workspace",
  workspace_read:"Read scratch workspace",workspace_list:"List scratch workspace",
  run_calculation:"Run a calculation",delegate:"Delegate to sub-agent",use_skill:"Use a skill"
};
async function loadProjectPermissionsPanel(){
  const projectId=activeProjectId();
  if(!projectId||!projectPermissionsSection){projectPermissionsSection?.classList.add("hidden");return}
  const project=projects.find(p=>p.id===projectId);
  if(projectPermissionsName)projectPermissionsName.textContent=project?.name||"this project";
  projectPermissionsSection.classList.remove("hidden");
  projectPermissionsList.innerHTML='<p class="emptyText">Loading…</p>';
  try{
    const r=await fetch(`${API_AGENT}?permissions=1&projectId=${encodeURIComponent(projectId)}`,{headers:headers(),cache:"no-store"});
    const d=await r.json();
    if(!d.ok)throw new Error();
    renderProjectPermissions(projectId,d.tools,d.project||{});
  }catch{projectPermissionsList.innerHTML='<p class="emptyText">⚠️ Could not load permissions right now.</p>'}
}
function renderProjectPermissions(projectId,tools,saved){
  if(!tools?.length){projectPermissionsList.innerHTML='<p class="emptyText">No configurable tools.</p>';return}
  projectPermissionsList.innerHTML="";
  tools.forEach(tool=>{
    const current=saved?.[tool]||"ask";
    const row=document.createElement("div");
    row.className="permissionRow";
    row.innerHTML=`<span class="permissionRowLabel">${escapeHTML(PERMISSION_LABELS[tool]||tool)}</span>
      <select class="permissionSelect" data-tool="${escapeHTML(tool)}">
        <option value="ask"${current==="ask"?" selected":""}>Ask (default)</option>
        <option value="auto"${current==="auto"?" selected":""}>Auto</option>
        <option value="never"${current==="never"?" selected":""}>Never</option>
      </select>`;
    row.querySelector("select").addEventListener("change",async(e)=>{
      const value=e.target.value;
      e.target.disabled=true;
      try{
        const r=await fetch(API_AGENT,{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify({setPermission:{projectId,tool,value}})});
        const d=await r.json();
        if(!d.ok)throw new Error(d.error||"failed");
        showToast(`✅ ${PERMISSION_LABELS[tool]||tool} set to ${value}`);
      }catch(error){showToast(`⚠️ ${error?.message||"Could not save permission"}`);e.target.value=current}
      e.target.disabled=false;
    });
    projectPermissionsList.appendChild(row);
  });
}

// ---- Phase 7: custom agents ----
let customAgents=[];
let customAgentToolCatalog=null;
const CUSTOM_AGENT_TOOL_LABELS={
  search:"Web search",deep_research:"Deep research",read_files:"Read your Files",
  workspace:"Scratch workspace",sandbox:"Exact calculations",code_exec:"Run code (sandbox)",
  files:"Save to Files",image:"Generate images",delegate:"Delegate to sub-agents"
};
async function loadCustomAgents(){
  try{
    const r=await fetch(API_CUSTOM_AGENTS,{headers:headers(),cache:"no-store"});
    const d=await r.json();
    customAgents=d.ok?(d.agents||[]):[];
  }catch{customAgents=[]}
  renderCustomAgentGrid();
}
function renderCustomAgentGrid(){
  if(!customAgentGrid)return;
  const cards=customAgents.map(a=>`<button class="agentCard" data-custom-agent="${escapeHTML(a.id)}"><span>${escapeHTML(a.icon||"🤖")}</span><strong>${escapeHTML(a.name)}</strong><small>${escapeHTML(a.description||"Custom agent")}</small></button>`).join("");
  customAgentGrid.innerHTML=cards+'<button class="agentCard customAgentCreateCard" id="createCustomAgentBtn" type="button"><span>➕</span><strong>Create agent</strong><small>Name it, write its method, pick its tools.</small></button>';
  document.getElementById("createCustomAgentBtn")?.addEventListener("click",()=>openCustomAgentModal(null));
  customAgentGrid.querySelectorAll("[data-custom-agent]").forEach(btn=>{
    btn.addEventListener("click",()=>launchWorkflow(`custom_agent:${btn.dataset.customAgent}`));
    btn.addEventListener("contextmenu",e=>{e.preventDefault();const agent=customAgents.find(a=>a.id===btn.dataset.customAgent);if(agent)openCustomAgentModal(agent)});
  });
}
async function ensureToolCatalog(){
  if(customAgentToolCatalog)return customAgentToolCatalog;
  try{
    const r=await fetch(`${API_CUSTOM_AGENTS}&catalog=1`,{headers:headers(),cache:"no-store"});
    const d=await r.json();
    customAgentToolCatalog=d.ok?d.tools:[];
  }catch{customAgentToolCatalog=[]}
  return customAgentToolCatalog;
}
async function openCustomAgentModal(agent){
  const tools=await ensureToolCatalog();
  customAgentToolList.innerHTML=tools.map(t=>`<label class="customAgentToolCheck"><input type="checkbox" value="${escapeHTML(t)}" ${agent?.allowedTools?.includes(t)?"checked":""}/> ${escapeHTML(CUSTOM_AGENT_TOOL_LABELS[t]||t)}</label>`).join("");
  customAgentModalTitle.textContent=agent?"Edit agent":"Create agent";
  customAgentId.value=agent?.id||"";
  customAgentIcon.value=agent?.icon||"🤖";
  customAgentName.value=agent?.name||"";
  customAgentDescription.value=agent?.description||"";
  customAgentInstructions.value=agent?.instructions||"";
  customAgentDeleteBtn.classList.toggle("hidden",!agent);
  customAgentModalOverlay.classList.remove("hidden");
}
function closeCustomAgentModal(){customAgentModalOverlay?.classList.add("hidden")}
customAgentModalClose?.addEventListener("click",closeCustomAgentModal);
customAgentCancelBtn?.addEventListener("click",closeCustomAgentModal);
customAgentModalOverlay?.addEventListener("click",e=>{if(e.target===customAgentModalOverlay)closeCustomAgentModal()});
customAgentDeleteBtn?.addEventListener("click",async()=>{
  const id=customAgentId.value;
  if(!id)return;
  if(!confirm("Delete this agent?"))return;
  try{
    const r=await fetch(`${API_CUSTOM_AGENTS}&id=${encodeURIComponent(id)}`,{method:"DELETE",headers:headers()});
    const d=await r.json();
    if(!d.ok)throw new Error(d.error);
    closeCustomAgentModal();showToast("🗑️ Agent deleted");loadCustomAgents();
  }catch(error){showToast(`⚠️ ${error?.message||"Delete failed"}`)}
});
customAgentForm?.addEventListener("submit",async(e)=>{
  e.preventDefault();
  const allowedTools=Array.from(customAgentToolList.querySelectorAll("input:checked")).map(i=>i.value);
  if(!allowedTools.length)return showToast("⚠️ Pick at least one tool");
  const payload={
    id:customAgentId.value||undefined,
    icon:customAgentIcon.value.trim()||"🤖",
    name:customAgentName.value.trim(),
    description:customAgentDescription.value.trim(),
    instructions:customAgentInstructions.value.trim(),
    allowedTools
  };
  try{
    const method=payload.id?"PUT":"POST";
    const r=await fetch(API_CUSTOM_AGENTS,{method,headers:headers({"Content-Type":"application/json"}),body:JSON.stringify(payload)});
    const d=await r.json();
    if(!d.ok)throw new Error(d.error);
    closeCustomAgentModal();showToast("✅ Agent saved");loadCustomAgents();
  }catch(error){showToast(`⚠️ ${error?.message||"Save failed"}`)}
});


async function loadMemoryInsight(){
  if(!memoryInsightText)return;
  memoryInsightText.textContent="Reflecting…";
  try{
    const r=await fetch("/api/memory?scope=insight",{headers:headers(),cache:"no-store"});
    const d=await r.json();
    memoryInsightText.textContent=d.ok?d.insight:(d.error||"Could not load a reflection right now.");
  }catch{memoryInsightText.textContent="Could not load a reflection right now."}
}
memoryInsightRefreshBtn?.addEventListener("click",loadMemoryInsight);
function memoryField(label,value){return `<div class="memoryField"><label>${escapeHTML(label)}</label><span class="${value?"":"empty"}">${escapeHTML(value||"Not yet known")}</span></div>`}
function renderMemoryPanel(m){memoryProfile.innerHTML=memoryField("Name",m?.name)+memoryField("Business / context",m?.business)+memoryField("User type",m?.role)+memoryField("Language",m?.language);const facts=Array.isArray(m?.facts)?m.facts:[];memoryFacts.innerHTML=facts.length?"":"<p class='emptyText'>Nothing yet — tell Kirong useful things or say “remember that…”</p>";facts.forEach((f,i)=>{const r=document.createElement("div");r.className="memoryFactRow";r.innerHTML=`<span>${escapeHTML(f.text)}</span><button>🗑️</button>`;r.querySelector("button").onclick=async()=>{const x=await fetch(`${API_MEMORY}?factIndex=${i}`,{method:"DELETE",headers:headers()}),d=await x.json();if(d.ok){renderMemoryPanel(d.memory);showToast("Forgotten")}};memoryFacts.appendChild(r)})}
forgetAllBtn?.addEventListener("click",async()=>{if(!confirm("Forget everything Kirong remembers about you?"))return;const r=await fetch(`${API_MEMORY}?all=true`,{method:"DELETE",headers:headers()}),d=await r.json();if(d.ok){renderMemoryPanel(d.memory);showToast("🗑️ Memory cleared")}});

async function loadFiles(){const projectId=activeProjectId();const url=projectId?`${API_FILES}?projectId=${encodeURIComponent(projectId)}`:API_FILES;try{const r=await fetch(url,{headers:headers(),cache:"no-store"}),d=await r.json();savedFiles=d.ok?d.files:[]}catch{savedFiles=[]}renderFiles()}
const selectedFileIds=new Set();
function renderFiles(){if(!savedFiles.length){workspaceFileList.innerHTML='<div class="emptyState"><div>📎</div><h3>Your private file shelf is empty</h3><p>Upload project notes, code, briefs or other working files.</p></div>';return}workspaceFileList.innerHTML="";savedFiles.forEach(f=>{const row=document.createElement("div");row.className="fileRow";row.innerHTML=`<input type="checkbox" data-select-file="${escapeHTML(f.id)}" ${selectedFileIds.has(f.id)?"checked":""}/><div class="fileIcon">📄</div><div class="fileRowBody"><strong>${escapeHTML(f.name)}</strong><small>${Math.round((Number(f.size)||0)/1024)} KB</small></div><button class="dangerIcon">🗑️</button>`;row.querySelector("[data-select-file]").onchange=e=>{if(e.target.checked)selectedFileIds.add(f.id);else selectedFileIds.delete(f.id)};row.querySelector("button.dangerIcon").onclick=async()=>{await fetch(`${API_FILES}?id=${encodeURIComponent(f.id)}`,{method:"DELETE",headers:headers()});selectedFileIds.delete(f.id);loadFiles()};workspaceFileList.appendChild(row)})}

document.querySelectorAll("[data-file-mode]").forEach(btn=>btn.addEventListener("click",()=>runFileTool(btn.dataset.fileMode)));
fileToolCopyBtn?.addEventListener("click",()=>{navigator.clipboard?.writeText(fileToolResultText?.textContent||"");showToast("📋 Copied")});

async function runFileTool(mode){
  const fileIds=Array.from(selectedFileIds);
  if(!fileIds.length)return showToast("⚠️ Select at least one file first");
  const text=String(fileToolInput?.value||"").trim();
  if(mode==="ask"&&!text)return showToast("⚠️ Type a question first");
  if(mode==="extract"&&!text)return showToast("⚠️ Say what to extract first");
  if(mode==="compare"&&fileIds.length<2)return showToast("⚠️ Select at least two files to compare");

  const body={mode,fileIds};
  if(mode==="ask")body.question=text;
  if(mode==="extract")body.instruction=text;
  if(mode==="report"&&text)body.focus=text;

  fileToolResult?.classList.remove("hidden");
  if(fileToolResultText)fileToolResultText.textContent="Working…";

  try{
    const r=await fetch(API_FILE_INSIGHT,{method:"POST",headers:headers({"Content-Type":"application/json"}),body:JSON.stringify(body)});
    const d=await r.json();
    if(!d.ok){if(fileToolResultText)fileToolResultText.textContent=`⚠️ ${d.error||"Could not analyze those files"}`;return}
    const output=d.answer||d.summary||d.comparison||d.extraction||d.report||"(no output)";
    if(fileToolResultText)fileToolResultText.textContent=output;
    if(d.failed?.length)showToast(`⚠️ Skipped ${d.failed.length} file(s) that couldn't be read`);
  }catch(error){if(fileToolResultText)fileToolResultText.textContent=`⚠️ ${error?.message||"File analysis failed"}`}
}
uploadFileBtn?.addEventListener("click",()=>workspaceFileInput?.click());workspaceFileInput?.addEventListener("change",async()=>{const projectId=activeProjectId();for(const f of Array.from(workspaceFileInput.files||[])){const form=new FormData();form.append("file",f,f.name);if(projectId)form.append("projectId",projectId);try{const r=await fetch(API_FILES,{method:"POST",headers:headers(),body:form});if(!r.ok)throw new Error()}catch{showToast(`⚠️ Could not upload ${f.name}`)}}workspaceFileInput.value="";await loadFiles();showToast(projectId?"📎 Files saved to this project":"📎 Files saved")});

function exportCurrentChat(){const c=(loadJSON(STORAGE.chats,[])||[]).find(x=>x.id===currentChatId),title=c?.title||"Kirong Chat",body=messages.map(m=>`${m.role==="assistant"?"KIRONG AI":"YOU"}:\n${m.content||""}`).join("\n\n────────────────────────\n\n"),blob=new Blob([`${title}\nExported from Kirong AI 👑\n\n${body}`],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=(title.replace(/[^a-z0-9]+/gi,"-")||"kirong-chat")+".txt";a.click();URL.revokeObjectURL(url);showToast("📥 Chat exported")}
exportBtn?.addEventListener("click",exportCurrentChat);
let recognition=null;function setupVoice(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR||!voiceBtn){voiceBtn?.setAttribute("hidden","");return}recognition=new SR();recognition.continuous=false;recognition.interimResults=false;recognition.onstart=()=>{voiceBtn.textContent="⏹"};recognition.onend=()=>{voiceBtn.textContent="🎙️"};recognition.onresult=e=>{userInput.value=`${userInput.value?userInput.value+" ":""}${Array.from(e.results).map(r=>r[0].transcript).join(" ")}`;autoResize();userInput.focus()};voiceBtn.onclick=()=>{try{recognition.start()}catch{recognition.stop()}}}
function autoResize(){userInput.style.height="auto";userInput.style.height=Math.min(userInput.scrollHeight,180)+"px"}userInput?.addEventListener("input",autoResize);userInput?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();composer.requestSubmit()}});
searchToggleBtn?.addEventListener("click",()=>{searchOn=!searchOn;saveJSON(STORAGE.searchOn,searchOn);updateSearchToggle()});function updateSearchToggle(){searchToggleBtn.setAttribute("aria-pressed",String(searchOn));searchToggleBtn.title=searchOn?"Web search: on":"Web search: off"}updateSearchToggle();
function setupPWA(){if("serviceWorker"in navigator)navigator.serviceWorker.register("/sw.js").catch(()=>{})}
// ============================================================
// 👑 COMMAND PALETTE (⌘K) — Phase 5
// ============================================================
const commandPaletteOverlay=document.getElementById("commandPaletteOverlay"), commandPaletteInput=document.getElementById("commandPaletteInput"), commandPaletteResults=document.getElementById("commandPaletteResults"), commandPaletteBtn=document.getElementById("commandPaletteBtn");
let commandPaletteActiveIndex=0, commandPaletteItems=[];

const TAB_LABELS={chat:"💬 Chat",projects:"📁 Projects",research:"🔎 Research",agents:"🤖 Agents",tools:"🛠️ Tools",memory:"🧠 Memory",files:"📎 Files",history:"🕘 History"};

function buildCommandList(){
  const cmds=[];
  Object.entries(TAB_LABELS).forEach(([tab,label])=>{
    cmds.push({icon:label.split(" ")[0],label:`Go to ${label.replace(/^\S+\s/,"")}`,hint:"Navigate",run:()=>switchTab(tab)});
  });
  cmds.push({icon:"＋",label:"New chat",hint:"Chat",run:()=>{startNewChat();switchTab("chat")}});
  cmds.push({icon:"🔎",label:searchOn?"Turn off live web search":"Turn on live web search",hint:"Chat",run:()=>{searchOn=!searchOn;saveJSON(STORAGE.searchOn,searchOn);updateSearchToggle()}});
  cmds.push({icon:"🎨",label:"Open Image Studio",hint:"Tools",run:()=>openImageStudio()});
  if(!planBadgeBox?.classList.contains("pro"))cmds.push({icon:"👑",label:"Upgrade to Kirong AI Pro",hint:"Account",run:()=>openProModal()});
  Object.entries(WORKFLOW_PRESETS).forEach(([kind,preset])=>{
    cmds.push({icon:preset.icon,label:`Launch ${preset.title}`,hint:"Agent job",run:()=>openWorkflowModal(kind)});
  });
  generators.forEach(g=>{
    cmds.push({icon:g.icon,label:`Generate: ${g.label}`,hint:"Generator",run:()=>{switchTab("tools");openGeneratorModal(g)}});
  });
  return cmds;
}

function renderCommandResults(query){
  const q=query.trim().toLowerCase();
  const all=buildCommandList();
  commandPaletteItems=q?all.filter(c=>c.label.toLowerCase().includes(q)||c.hint.toLowerCase().includes(q)):all;
  commandPaletteActiveIndex=0;
  if(!commandPaletteItems.length){commandPaletteResults.innerHTML='<p class="emptyText">No matching commands.</p>';return}
  commandPaletteResults.innerHTML=commandPaletteItems.map((c,i)=>`<button type="button" class="commandPaletteItem${i===0?" active":""}" data-cmd-index="${i}"><span>${c.icon}</span><span class="commandPaletteLabel">${escapeHTML(c.label)}</span><span class="commandPaletteHint">${escapeHTML(c.hint)}</span></button>`).join("");
  commandPaletteResults.querySelectorAll("[data-cmd-index]").forEach(btn=>{
    btn.addEventListener("click",()=>runCommandAt(Number(btn.dataset.cmdIndex)));
  });
}
function highlightCommand(index){
  const rows=commandPaletteResults.querySelectorAll(".commandPaletteItem");
  if(!rows.length)return;
  commandPaletteActiveIndex=(index+rows.length)%rows.length;
  rows.forEach((r,i)=>r.classList.toggle("active",i===commandPaletteActiveIndex));
  rows[commandPaletteActiveIndex]?.scrollIntoView({block:"nearest"});
}
function runCommandAt(index){
  const cmd=commandPaletteItems[index];
  if(!cmd)return;
  closeCommandPalette();
  cmd.run();
}
function openCommandPalette(){
  commandPaletteOverlay.classList.remove("hidden");
  commandPaletteInput.value="";
  renderCommandResults("");
  setTimeout(()=>commandPaletteInput.focus(),20);
}
function closeCommandPalette(){commandPaletteOverlay.classList.add("hidden")}
commandPaletteBtn?.addEventListener("click",openCommandPalette);
document.getElementById("commandPaletteSidebarBtn")?.addEventListener("click",()=>{closeSidebar();openCommandPalette()});
commandPaletteOverlay?.addEventListener("click",e=>{if(e.target===commandPaletteOverlay)closeCommandPalette()});
commandPaletteInput?.addEventListener("input",()=>renderCommandResults(commandPaletteInput.value));
commandPaletteInput?.addEventListener("keydown",e=>{
  if(e.key==="ArrowDown"){e.preventDefault();highlightCommand(commandPaletteActiveIndex+1)}
  else if(e.key==="ArrowUp"){e.preventDefault();highlightCommand(commandPaletteActiveIndex-1)}
  else if(e.key==="Enter"){e.preventDefault();runCommandAt(commandPaletteActiveIndex)}
  else if(e.key==="Escape"){closeCommandPalette()}
});
document.addEventListener("keydown",e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){
    e.preventDefault();
    commandPaletteOverlay.classList.contains("hidden")?openCommandPalette():closeCommandPalette();
  }
});

async function init(){restoreChat();renderHistoryList();renderFilePreview();autoResize();setupVoice();setupPWA();loadGenerators();loadProjects();loadFiles();renderImageGallery();renderMissionCenter();refreshUserProfile();syncRemote();renderAccountBadge();refreshAccount().then(()=>{workspaceStatus.textContent=currentAccount?`Signed in as ${currentAccount.email} · synced`:"Guest workspace · private backend sync"});workspaceStatus.textContent="Guest workspace · private backend sync";console.log("👑 Kirong AI ready —",DEVICE_ID);hideRoyalSplash()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();

// 👑 Boot splash — animated for feel, but only actually dismisses once
// init() above has really finished (plus a minimum display time so it
// never flashes on a fast connection). A safety timeout force-hides it
// regardless, so a slow network or a bug in init() never traps someone
// behind the loading screen forever.
(function(){
  const splash=document.getElementById("royal-splash");
  if(!splash)return;
  const bar=document.getElementById("royal-splash-bar"), pct=document.getElementById("royal-splash-percent");
  const shownAt=Date.now();
  let progress=0, realDone=false, hidden=false;
  const tick=setInterval(()=>{
    progress=Math.min(progress+Math.random()*10+3,realDone?100:92);
    if(bar)bar.style.width=progress+"%";
    if(pct)pct.textContent=Math.floor(progress)+"%";
    if(progress>=100)clearInterval(tick);
  },90);
  window.hideRoyalSplash=function(){
    realDone=true;
    const elapsed=Date.now()-shownAt;
    const wait=Math.max(0,450-elapsed);
    setTimeout(()=>{
      if(hidden)return;hidden=true;
      if(bar)bar.style.width="100%";
      if(pct)pct.textContent="100%";
      setTimeout(()=>{splash.classList.add("hide");setTimeout(()=>splash.remove(),600)},150);
    },wait);
  };
  setTimeout(()=>{if(!hidden)window.hideRoyalSplash()},6000); // safety net
})();
