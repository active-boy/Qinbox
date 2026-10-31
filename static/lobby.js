let qinCustomKey='';
window.qinApiHeaders=()=>{
  if(!qinCustomKey)return {};
  if(!/^sk-[A-Za-z0-9_-]{8,}$/.test(qinCustomKey))throw new Error('DeepSeek Key 格式不正确，请检查 sk- 开头的 Key。');
  return {'X-Custom-Api-Key':qinCustomKey};
};
window.qinApiFetch=(url,options={})=>fetch(url,{...options,headers:{...(options.headers||{}),...window.qinApiHeaders()}});
window.qinApiSettingsHtml=()=>`<div class="api-settings"><b>接口设置</b><label for="qin-api-key">激活码 / DeepSeek Key</label><input id="qin-api-key" class="qin-api-key" type="password" autocomplete="off" placeholder="12345678 或 sk- 开头的 Key"><small>输入 12345678 使用服务器额度，或输入自己的 DeepSeek Key。Key 只保存在当前页面内存；刷新后需重新输入。</small><span class="qin-api-status">${qinCustomKey?'自定义 Key 已就绪':'未填写时使用服务器配置'}</span></div>`;
window.qinBindApiSettings=host=>{
  if(!host)return;host.innerHTML=window.qinApiSettingsHtml();
  const input=host.querySelector('.qin-api-key');input.value=qinCustomKey;input.oninput=()=>{const value=input.value.trim();qinCustomKey=value==='12345678'?'':value;host.querySelector('.qin-api-status').textContent=value==='12345678'?'将使用服务器配置':qinCustomKey?'自定义 Key 已就绪':'未填写时使用服务器配置';};
};
window.qinBindApiSettings(document.querySelector('#api-settings-lobby-host'));

const authScreen=document.querySelector('#auth-screen'),lobby=document.querySelector('#lobby-screen'),appShell=document.querySelector('.app-shell');
document.querySelectorAll('[data-auth-mode]').forEach(b=>b.onclick=()=>{document.querySelector('#login-form').classList.toggle('hidden',b.dataset.authMode!=='login');document.querySelector('#register-form').classList.toggle('hidden',b.dataset.authMode!=='register');document.querySelector('#auth-message').textContent='';});
async function authSubmit(form,endpoint){const data=Object.fromEntries(new FormData(form));const msg=document.querySelector('#auth-message');msg.textContent='正在处理…';try{const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const out=await res.json();if(!res.ok)throw Error(out.error||'请求失败');if(endpoint==='/api/register'){qinCustomKey=out.apiMode==='byok'?data.activationCode.trim():'';document.querySelector('#lobby-user-name').textContent=data.username;authScreen.classList.add('hidden');lobby.classList.remove('hidden');window.qinBindApiSettings(document.querySelector('#api-settings-lobby-host'));form.reset();}else location.reload();}catch(e){msg.textContent=e.message;}}
document.querySelector('#login-form')?.addEventListener('submit',e=>{e.preventDefault();authSubmit(e.currentTarget,'/api/login');});
document.querySelector('#register-form')?.addEventListener('submit',e=>{e.preventDefault();authSubmit(e.currentTarget,'/api/register');});
document.querySelector('#logout-button')?.addEventListener('click',async()=>{await fetch('/api/logout',{method:'POST'});location.reload();});
document.querySelector('#enter-dream')?.addEventListener('click',()=>{try{window.qinApiHeaders();}catch(e){document.querySelector('.qin-api-status').textContent=e.message;document.querySelector('.qin-api-key')?.focus();return;}lobby.classList.add('opening');setTimeout(()=>{lobby.classList.add('hidden');appShell.classList.add('ready');},850);});
if(window.QIN_ACCOUNT){authScreen?.classList.add('hidden');}else{lobby?.classList.add('hidden');appShell?.classList.add('hidden');}
