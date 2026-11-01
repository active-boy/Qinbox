let qinCustomKey='';
window.qinApiHeaders=()=>{
  if(!qinCustomKey)return {};
  if(!/^sk-[A-Za-z0-9_-]{8,}$/.test(qinCustomKey))throw new Error('DeepSeek Key 格式不正确，请检查 sk- 开头的 Key。');
  return {'X-Custom-Api-Key':qinCustomKey};
};
window.qinApiFetch=(url,options={})=>fetch(url,{...options,headers:{...(options.headers||{}),...window.qinApiHeaders()}});
window.qinApiSettingsHtml=()=>`<div class="api-settings"><b>接口设置</b><label for="qin-api-key">自带 DeepSeek Key（可选）</label><input id="qin-api-key" class="qin-api-key" type="password" autocomplete="off" placeholder="留空使用服务器配置"><small>Key 只保存在当前页面内存；刷新后需重新输入。</small><span class="qin-api-status">${qinCustomKey?'自定义 Key 已就绪':'当前使用服务器配置'}</span></div>`;
window.qinBindApiSettings=host=>{
  if(!host)return;host.innerHTML=window.qinApiSettingsHtml();
  const input=host.querySelector('.qin-api-key');input.value=qinCustomKey;input.oninput=()=>{qinCustomKey=input.value.trim();host.querySelector('.qin-api-status').textContent=qinCustomKey?'自定义 Key 已就绪':'当前使用服务器配置';};
};

const authScreen=document.querySelector('#auth-screen'),lobby=document.querySelector('#lobby-screen'),appShell=document.querySelector('.app-shell');
document.querySelectorAll('[data-auth-mode]').forEach(b=>b.onclick=()=>{document.querySelector('#login-form').classList.toggle('hidden',b.dataset.authMode!=='login');document.querySelector('#register-form').classList.toggle('hidden',b.dataset.authMode!=='register');document.querySelector('#auth-message').textContent='';});
async function authSubmit(form,endpoint){const data=Object.fromEntries(new FormData(form));const msg=document.querySelector('#auth-message');msg.textContent='正在处理…';try{const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(data)});const out=await res.json();if(!res.ok)throw Error(out.error||'请求失败');if(endpoint==='/api/register')qinCustomKey=out.apiMode==='byok'?data.activationCode.trim():'';const sessionRes=await fetch('/api/session',{credentials:'same-origin'});const identity=await sessionRes.json();if(!sessionRes.ok||!identity.authenticated)throw Error(endpoint==='/api/register'?'账号已提交，但云端登录状态未建立。请稍后返回登录；若仍失败，请检查云托管会话配置。':'账号验证通过，但云端登录状态未保存。请重试；若仍失败，请检查云托管会话配置。');window.QIN_ACCOUNT=identity.userId;window.QIN_ACCOUNT_NAME=identity.username||data.username;await window.qinInitializeAccountSave?.();document.querySelector('#lobby-user-name').textContent=window.QIN_ACCOUNT_NAME;authScreen.classList.add('hidden');lobby.classList.remove('hidden');appShell.classList.remove('hidden');msg.textContent='';form.reset();}catch(e){msg.textContent=e.message;}}
document.querySelector('#login-form')?.addEventListener('submit',e=>{e.preventDefault();authSubmit(e.currentTarget,'/api/login');});
document.querySelector('#register-form')?.addEventListener('submit',e=>{e.preventDefault();authSubmit(e.currentTarget,'/api/register');});
document.querySelector('#logout-button')?.addEventListener('click',async()=>{await fetch('/api/logout',{method:'POST'});location.reload();});
document.querySelector('#enter-dream')?.addEventListener('click',()=>{lobby.classList.add('opening');setTimeout(()=>{lobby.classList.add('hidden');appShell.classList.add('ready');},850);});
if(window.QIN_ACCOUNT){authScreen?.classList.add('hidden');}else{lobby?.classList.add('hidden');appShell?.classList.add('hidden');}
if(window.QIN_STATIC_HOST){fetch('/api/session',{credentials:'same-origin'}).then(response=>response.ok?response.json():null).then(data=>{if(!data?.authenticated)return;window.QIN_ACCOUNT=data.userId;window.QIN_ACCOUNT_NAME=data.username;authScreen?.classList.add('hidden');lobby?.classList.remove('hidden');appShell?.classList.remove('hidden');const label=document.querySelector('#lobby-user-name');if(label)label.textContent=data.username;return window.qinInitializeAccountSave?.();}).catch(()=>{});}
