import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const ADMIN_UID = "pyoHLYsAf0ga43zEBCoOwQQbQk62";
const contentRef = doc(db, "portfolio", "content");
const $ = id => document.getElementById(id);
const openButton=$("adminLoginBtn"), modal=$("adminLoginModal"), form=$("adminLoginForm"), message=$("adminLoginMessage"), submit=$("adminSubmit");
const feedback=$("adminFeedback"), feedbackMark=$("adminFeedbackMark"), feedbackText=$("adminFeedbackText");
const saveSuccess=$("adminSaveSuccess");
const signedIn=$("adminSignedIn"), signOutButton=$("adminSignOut"), editor=$("adminEditor"), saveButton=$("adminSaveChanges"), saveMessage=$("adminSaveMessage");
let content={skills:[],projects:[],certificates:[],education:[]};

const fields=[
 {key:"heroName",label:"Home — Your name",selector:".hero-copy h1"},
 {key:"homeEyebrow",label:"Home — Greeting",selector:".hero-copy .eyebrow"},
 {key:"aboutSectionHeading",label:"About — Section heading",selector:"#about .section-heading h2"},
 {key:"educationSectionHeading",label:"Education — Section heading",selector:"#education .section-heading h2"},
 {key:"skillsSectionHeading",label:"Skills — Section heading",selector:"#skills .section-heading h2"},
 {key:"projectsSectionHeading",label:"Projects — Section heading",selector:"#projects .section-heading h2"},
 {key:"certificatesSectionHeading",label:"Certificates — Section heading",selector:"#certificates .section-heading h2"},
 {key:"contactSectionHeading",label:"Contact — Section heading",selector:"#contact .section-heading h2"},
 {key:"heroRole",label:"Home — Your role (Web Developer | Digital Marketer | CIT Student)",selector:".hero-copy h2"},
 {key:"tiktokUrl",label:"Social — TikTok profile URL",selector:".social-row .tiktok",special:"url"},
 {key:"heroIntro",label:"Home — Introduction",selector:".hero-intro",multiline:true},
 {key:"aboutHeading",label:"About — Heading",selector:"#about .about-card h3"},
 {key:"aboutText1",label:"About — Paragraph 1",selector:"#about .about-card p:nth-of-type(1)",multiline:true},
 {key:"aboutText2",label:"About — Paragraph 2",selector:"#about .about-card p:nth-of-type(2)",multiline:true},
 {key:"educationTitle1",label:"Education — Qualification",selector:"#education .timeline-item:nth-child(1) h3"},
 {key:"educationText1",label:"Education — Details",selector:"#education .timeline-item:nth-child(1) p"},
 {key:"educationTitle2",label:"Education — School",selector:"#education .timeline-item:nth-child(2) h3"},
 {key:"educationText2",label:"Education — School details",selector:"#education .timeline-item:nth-child(2) p"},
 ...Array.from({length:6},(_,i)=>({key:`skillTitle${i+1}`,label:`Skills — Card ${i+1} title`,selector:`#skills .skill-card:nth-child(${i+1}) h3`})),
 ...Array.from({length:6},(_,i)=>({key:`skillText${i+1}`,label:`Skills — Card ${i+1} description`,selector:`#skills .skill-card:nth-child(${i+1}) p`})),
 {key:"projectTitle",label:"Projects — Project name",selector:"#projects .project-body h3"},
 {key:"projectButton",label:"Projects — Button text",selector:"#projects .project-link"},
 {key:"footerCopyright",label:"Footer — Copyright",selector:"footer > span"},
 {key:"projectDescription",label:"Projects — Description",selector:"#projects .project-body > p",multiline:true},
 {key:"contactEmail",label:"Contact — Email address",selector:".contact-card a[href^='mailto:']",special:"email"},
 {key:"whatsappNumber",label:"WhatsApp — Phone number (international format, digits only)",selector:".contact-card a[href*='wa.me/']",special:"whatsapp"},
 {key:"contactLocation",label:"Contact — Location",selector:".contact-card p",special:"location"}
];
function readField(f){const el=document.querySelector(f.selector);if(!el)return "";if(f.key==="homeEyebrow")return el.textContent.trim();if(f.special==="email")return el.getAttribute("href").replace(/^mailto:/,"");if(f.special==="url")return el.getAttribute("href")||"";if(f.special==="whatsapp")return el.getAttribute("href").replace(/^https:\/\/wa\.me\//,"");if(f.special==="location")return el.textContent.replace(/^⌖\s*/,"").trim();return el.textContent.trim();}
function applyField(f,v){const el=document.querySelector(f.selector);if(!el||typeof v!=="string")return;
 if(f.special==="url"){try{const u=new URL(v);if(!["https:","http:"].includes(u.protocol))return;el.href=u.href;el.classList.remove("unavailable");}catch{return;}}
 else if(f.special==="email"){el.href=`mailto:${v}`;const icon=el.querySelector("span");el.textContent="";if(icon)el.appendChild(icon);el.appendChild(document.createTextNode(" "+v));}
 else if(f.special==="whatsapp"){const d=v.replace(/\D/g,"");if(!d)return;document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>a.href=`https://wa.me/${d}`);const a=document.querySelector(".contact-card a[href*='wa.me/']:not(.whatsapp-cta)");if(a){const icon=a.querySelector("img");a.textContent="";if(icon)a.appendChild(icon);a.appendChild(document.createTextNode(" WhatsApp: +"+d));}}
 else if(f.key==="homeEyebrow"){const dot=el.querySelector("i");el.textContent=v;if(dot)el.prepend(dot);}
 else if(f.special==="location"){const icon=el.querySelector("span");el.textContent="";if(icon)el.appendChild(icon);el.appendChild(document.createTextNode(" "+v));}
 else if(f.key==="heroName"){const p=v.trim().split(/\s+/),first=p.shift()||"",last=p.join(" ");el.textContent="";el.appendChild(document.createTextNode(first+" "));const s=document.createElement("span");s.textContent=last;el.appendChild(s);}
 else if(f.key==="heroRole"){el.replaceChildren();v.split("|").map(x=>x.trim()).filter(Boolean).forEach((part,i)=>{if(i){const sep=document.createElement("em");sep.textContent="|";el.append(" ",sep," ");}el.append(document.createTextNode(part));});}
 else el.textContent=v;
}
function buildEditor(data={}){editor.replaceChildren();fields.forEach(f=>{const label=document.createElement("label");label.className="admin-field";label.textContent=f.label;const input=f.multiline?document.createElement("textarea"):document.createElement("input");input.value=Object.hasOwn(data,f.key)?data[f.key]:readField(f);input.dataset.fieldKey=f.key;label.appendChild(input);editor.appendChild(label);});}
function getInitialArray(kind){
 if(kind==="skills")return [...document.querySelectorAll("#skills .skill-card")].map(c=>({name:c.querySelector("h3")?.textContent||"",description:c.querySelector("p")?.textContent||"",image:c.querySelector("img")?.getAttribute("src")||""}));
 if(kind==="projects"){const c=document.querySelector("#projects .project-card");return c?[{name:c.querySelector(".project-body h3")?.textContent||"",description:c.querySelector(".project-body > p")?.textContent||"",image:"",link:c.querySelector(".project-link")?.href||"",tags:[...c.querySelectorAll(".project-tags span")].map(x=>x.textContent).join(", ")}]:[];}
 if(kind==="certificates")return [...document.querySelectorAll("#certificates .certificate-card")].map(c=>({name:c.dataset.title||c.querySelector("b")?.textContent||"",details:c.querySelector("small")?.textContent||"",image:c.dataset.certificate||c.querySelector("img")?.src||""}));
 if(kind==="education")return [...document.querySelectorAll("#education .timeline-item")].map(c=>({name:c.querySelector("h3")?.textContent||"",details:c.querySelector("p")?.textContent||"",label:c.querySelector("small")?.textContent||""}));
 return [];
}
function renderCollections(){
 const defs=[["skills","skillList","name"],["projects","projectList","name"],["certificates","certificateList","name"],["education","educationList","name"]];
 defs.forEach(([kind,listId,titleKey])=>{const list=$(listId);list.replaceChildren();content[kind].forEach((item,i)=>{const row=document.createElement("div");row.className="admin-item-row";const title=document.createElement("strong");title.textContent=item[titleKey]||`Untitled ${kind.slice(0,-1)}`;const actions=document.createElement("div");actions.className="admin-item-actions";const edit=document.createElement("button");edit.type="button";edit.textContent="Edit";edit.onclick=()=>fillForm(kind,i);const del=document.createElement("button");del.type="button";del.textContent="Delete";del.onclick=async()=>{if(!confirm(`Delete "${title.textContent}"?`))return;content[kind].splice(i,1);await persistCollections();};actions.append(edit,del);row.append(title,actions);list.append(row);});});
}
function fillForm(kind,i){const item=content[kind][i];const map={skills:[["skillName","name"],["skillDescription","description"],["skillImage","image"],["skillEditIndex",null]],projects:[["projectName","name"],["projectDescriptionInput","description"],["projectImage","image"],["projectLink","link"],["projectTags","tags"],["projectEditIndex",null]],certificates:[["certificateName","name"],["certificateDetails","details"],["certificateImage","image"],["certificateEditIndex",null]],education:[["educationTitle","name"],["educationDetails","details"],["educationLabel","label"],["educationEditIndex",null]]};map[kind].forEach(([id,key])=>$(id).value=key?item[key]||"":i);}
function collectForm(kind){const get=id=>$(id).value.trim();if(kind==="skills")return {name:get("skillName"),description:get("skillDescription"),image:get("skillImage")};if(kind==="projects")return {name:get("projectName"),description:get("projectDescriptionInput"),image:get("projectImage"),link:get("projectLink"),tags:get("projectTags")};if(kind==="certificates")return {name:get("certificateName"),details:get("certificateDetails"),image:get("certificateImage")};return {name:get("educationTitle"),details:get("educationDetails"),label:get("educationLabel")};}
async function persistCollections(){try{await setDoc(contentRef,{...content},{merge:true});renderCollections();renderPublicCollections();saveMessage.textContent="Saved. The public portfolio has been updated."; }catch(e){saveMessage.textContent="Save failed: "+e.message;}}
function renderPublicCollections(){
 const skillGrid=$("#skills .skills-grid");if(skillGrid&&content.skills.length){skillGrid.replaceChildren();content.skills.forEach(x=>{const card=document.createElement("article");card.className="skill-card reveal";const logo=document.createElement("span");logo.className="skill-logo";const img=document.createElement("img");img.src=x.image;img.alt=x.name+" logo";logo.append(img);const h=document.createElement("h3");h.textContent=x.name;const p=document.createElement("p");p.textContent=x.description;card.append(logo,h,p);skillGrid.append(card);});}
 const projectSection=$("#projects");if(projectSection&&content.projects.length){let grid=projectSection.querySelector(".admin-dynamic-projects");if(!grid){grid=document.createElement("div");grid.className="admin-dynamic-projects";projectSection.append(grid);}grid.replaceChildren();content.projects.forEach(x=>{const card=document.createElement("article");card.className="project-card reveal";const cover=document.createElement("div");cover.className="project-cover";if(x.image){const img=document.createElement("img");img.src=x.image;img.alt=x.name;img.style.cssText="width:100%;height:100%;object-fit:cover";cover.append(img);}const body=document.createElement("div");body.className="project-body";const tags=document.createElement("div");tags.className="project-tags";(x.tags||"").split(",").map(t=>t.trim()).filter(Boolean).forEach(t=>{const s=document.createElement("span");s.textContent=t;tags.append(s);});const h=document.createElement("h3");h.textContent=x.name;const p=document.createElement("p");p.textContent=x.description;body.append(tags,h,p);if(x.link){const a=document.createElement("a");a.className="btn btn-primary project-link";a.href=x.link;a.target="_blank";a.rel="noopener";a.textContent="View Live Project ↗";body.append(a);}card.append(cover,body);grid.append(card);});const old=projectSection.querySelector(":scope > .project-card");if(old)old.hidden=true;}
 const certGrid=$("#certificates .certificates-grid");if(certGrid&&content.certificates.length){certGrid.replaceChildren();content.certificates.forEach(x=>{const b=document.createElement("button");b.type="button";b.className="certificate-card reveal";b.dataset.certificate=x.image;b.dataset.title=x.name;const img=document.createElement("img");img.src=x.image;img.alt=x.name;img.loading="lazy";const cap=document.createElement("span");cap.className="certificate-caption";const strong=document.createElement("b");strong.textContent=x.name;const small=document.createElement("small");small.textContent=x.details||"";const em=document.createElement("em");em.textContent="View Certificate ↗";cap.append(strong,small,em);b.append(img,cap);certGrid.append(b);});}
 const edu=$("#education .timeline");if(edu&&content.education.length){edu.replaceChildren();content.education.forEach(x=>{const item=document.createElement("article");item.className="timeline-item reveal";const dot=document.createElement("span");dot.className="timeline-dot";const card=document.createElement("div");card.className="info-card";const sm=document.createElement("small");sm.textContent=x.label||"";const h=document.createElement("h3");h.textContent=x.name;const p=document.createElement("p");p.textContent=x.details;card.append(sm,h,p);item.append(dot,card);edu.append(item);});}
}
function openModal(){hideFeedback();if(saveSuccess)saveSuccess.hidden=true;modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";}
function showOwnerState(owner){form.hidden=owner;feedback.hidden=true;signedIn.hidden=!owner;openButton.textContent=owner?"Owner Dashboard":"Admin Login";}
async function loadContent(){
 const snap=await getDoc(contentRef);
 content=snap.exists()?snap.data():{};
 // Re-apply saved scalar fields whenever the page loads. Previously these values
 // were only applied immediately after clicking Save, so a refresh restored the
 // original HTML text even though Firestore contained the new values.
 fields.forEach(f=>{
  if(Object.hasOwn(content,f.key) && typeof content[f.key]==="string"){
   applyField(f,content[f.key]);
  }
 });
 ["skills","projects","certificates","education"].forEach(k=>{
  if(!Array.isArray(content[k]))content[k]=getInitialArray(k);
 });
 renderPublicCollections();
 renderCollections();
 buildEditor(content);
}
openButton.addEventListener("click",async()=>{openModal();if(auth.currentUser?.uid===ADMIN_UID){await loadContent();}});
modal.querySelectorAll("[data-admin-close]").forEach(el=>el.addEventListener("click",closeModal));
function showFeedback(ok,text){feedback.hidden=false;feedback.classList.remove("success","error");feedback.classList.add(ok?"success":"error");feedbackMark.textContent=ok?"✓":"✕";feedbackText.textContent=text;form.hidden=true;}
function hideFeedback(){feedback.hidden=true;feedback.classList.remove("success","error");form.hidden=false;}
form.addEventListener("submit",async e=>{e.preventDefault();message.textContent="";submit.disabled=true;try{const c=await signInWithEmailAndPassword(auth,$("adminEmail").value.trim(),$("adminPassword").value);if(c.user.uid!==ADMIN_UID){await signOut(auth);throw new Error("This account is not authorized.");}showFeedback(true,"Login Successful");await new Promise(r=>setTimeout(r,1050));showOwnerState(true);await loadContent();feedback.hidden=true;}catch(err){const bad=err.code==="auth/invalid-credential"||err.code==="auth/wrong-password"||err.code==="auth/user-not-found";showFeedback(false,bad?"Incorrect Password":"Access Denied");setTimeout(()=>{hideFeedback();message.textContent=bad?"Email or password is incorrect.":err.message;},1250);}finally{submit.disabled=false;}});
onAuthStateChanged(auth,async user=>{const owner=!!user&&user.uid===ADMIN_UID;showOwnerState(owner);if(user&&!owner){await signOut(auth);return;}if(owner)await loadContent();});
saveButton.addEventListener("click",async()=>{
 if(auth.currentUser?.uid!==ADMIN_UID)return;
 saveButton.disabled=true;saveMessage.textContent="Saving your changes…";
 try{
  const data={};editor.querySelectorAll("[data-field-key]").forEach(i=>data[i.dataset.fieldKey]=i.value.trim());
  await setDoc(contentRef,data,{merge:true});
  fields.forEach(f=>{if(Object.hasOwn(data,f.key))applyField(f,data[f.key]);});
  saveMessage.textContent="";
  if(saveSuccess){saveSuccess.hidden=false;saveSuccess.classList.remove("show");void saveSuccess.offsetWidth;saveSuccess.classList.add("show");}
  await new Promise(resolve=>setTimeout(resolve,1350));
  closeModal();
  if(saveSuccess)saveSuccess.hidden=true;
 }catch(e){saveMessage.textContent="Save failed: "+e.message;}
 finally{saveButton.disabled=false;}
});
signOutButton.addEventListener("click",async()=>{await signOut(auth);showOwnerState(false);form.reset();closeModal();});
const formDefs=[["skillForm","skills","skillEditIndex"],["projectForm","projects","projectEditIndex"],["certificateForm","certificates","certificateEditIndex"],["educationForm","education","educationEditIndex"]];
formDefs.forEach(([formId,kind,indexId])=>$(formId).addEventListener("submit",async e=>{e.preventDefault();if(auth.currentUser?.uid!==ADMIN_UID)return;const index=$(indexId).value;const item=collectForm(kind);if(index!==""){content[kind][Number(index)]=item;}else content[kind].push(item);await persistCollections();$(formId).reset();$(indexId).value="";}));
document.addEventListener("click",e=>{const card=e.target.closest(".certificate-card[data-certificate]");if(!card)return;const modal=$("#certificateModal"),img=$("#certificateLarge"),title=$("#certificateTitle");img.src=card.dataset.certificate;img.alt=card.dataset.title;title.textContent=card.dataset.title;modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeModal();});
loadContent().catch(e=>console.warn("Portfolio content load:",e));
