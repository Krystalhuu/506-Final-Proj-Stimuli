const params = new URLSearchParams(location.search);
const condition = params.get('condition') || '1';
const isParticipant = params.get('view') === 'participant';

const STORAGE_KEY = `powerbank-stimulus-config-${condition}`;

const conditionDefaults = {
  '1': { source: 'AI Shopping Assistant Pick', showExplanation: true },
  '2': { source: 'AI Shopping Assistant Pick', showExplanation: false },
  '3': { source: 'Our Expert Team Pick', showExplanation: true },
  '4': { source: 'Our Expert Team Pick', showExplanation: false },
  '5': { source: '1000+ Previous Customers Pick', showExplanation: true },
  '6': { source: '1000+ Previous Customers Pick', showExplanation: false },
};

const defaults = {
  retailer: 'Everyday Supply',
  brand: 'GVlio',
  name: 'Compact Power Bank',
  price: '$14.99',
  source: 'AI Shopping Assistant Pick',
  sourceNote: 'You recently viewed several other products from this brand. Based on your past purchasing behavior, this product matches your purchasing preferences. Our AI assistant compared similar products based on power output, battery capacity, and price.',
  explanation: 'GVlio-8 Pro, with a 10,000 mAh battery, USB-C connectivity, and up to 20W output.',
  capacity: '10,000 mAh',
  connection: 'USB-C',
  output: '20W',
  weight: '6.8 oz',
  dimensions: '4.2 × 2.6 × 0.6 in',
  showExplanation: true,
  ...(conditionDefaults[condition] || {}),
};

function validated(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw Error('Choose a valid stimulus configuration.');
  const result = { ...defaults };
  for (const k of Object.keys(defaults)) {
    if (k in value) {
      if (k === 'showExplanation') {
        if (typeof value[k] !== 'boolean')
          throw Error('Explanation setting must be true or false.');
      } else if (typeof value[k] !== 'string' || value[k].length > 5000) {
        throw Error('Invalid text field: ' + k);
      }
      result[k] = value[k];
    }
  }
  return result;
}



let state = { ...defaults };

function saveStateToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function loadStateFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return validated(JSON.parse(raw));
  } catch (e) {
    return null;
  }
}



try {
  if (location.hash.length > 1) {
    state = validated(JSON.parse(decodeURIComponent(location.hash.slice(1))));
  } else {
    const saved = loadStateFromStorage();
    if (saved) state = saved;
  }
} catch (e) {
  document.getElementById('status').textContent = 'Unable to load configuration; showing defaults.';
}



function update() {
  render();
  broadcast();
  saveStateToStorage();
}


const participant = isParticipant;
if (participant) {
  document.body.classList.add('participant');
  document.title = state.name + ' | ' + state.retailer;
}
let noteOpen = false;


const labels={retailer:'Retailer name',brand:'Product brand',name:'Product name',price:'Price',source:'AI recommendation label',sourceNote:'Explanation',explanation:'Product Description'};
function render(){document.querySelectorAll('[data-field]').forEach(el=>el.textContent=state[el.dataset.field]??'');

    const note=document.querySelector('.source-note');
    const noteVisible=state.showExplanation&&(!participant||noteOpen);
    note.hidden=!noteVisible;note.style.display=noteVisible?'block':'none';
    note.setAttribute('aria-hidden',String(!noteVisible));
    const seeWhy=document.getElementById('seeWhy');
    seeWhy.style.display=state.showExplanation&&participant&&!noteOpen?'inline-block':'none';
    const feedbackBox = document.getElementById('feedbackBox');
    const isFeedbackCondition = ['1', '3', '5'].includes(condition);
    const feedbackVisible = isFeedbackCondition && state.showExplanation && noteVisible;
    feedbackBox.hidden = !feedbackVisible;
    feedbackBox.style.display = feedbackVisible ? 'block' : 'none';
    feedbackBox.setAttribute('aria-hidden', String(!feedbackVisible));

    const conditionLabels = {
        '1': 'AI · Explanation present',
        '2': 'AI · Explanation absent',
        '3': 'Expert · Explanation present',
        '4': 'Expert · Explanation absent',
        '5': 'Customers · Explanation present',
        '6': 'Customers · Explanation absent',
        };
    document.getElementById('condition').textContent =
    conditionLabels[condition] || 'AI · Explanation present';

    const url = new URL(location.href);
    url.search = `?condition=${condition}&view=participant`;
    url.hash = encodeURIComponent(JSON.stringify(state));
    document.getElementById('preview').href = url.href;
}

const liveChannel = typeof BroadcastChannel === 'function'
  ? new BroadcastChannel('powerbank-stimulus-live')
  : null;

function broadcast(){
    const payload=JSON.stringify(state);liveChannel?.postMessage(state);
    try{localStorage.setItem('powerbank-stimulus-live',payload);}catch(e){}}

    
function acceptLiveState(value){try{state=validated(value);const url=new URL(location.href);url.hash=encodeURIComponent(JSON.stringify(state));history.replaceState(null,'',url);render();}catch(e){}}
if(participant){liveChannel?.addEventListener('message',event=>acceptLiveState(event.data));window.addEventListener('storage',event=>{if(event.key==='powerbank-stimulus-live'&&event.newValue)acceptLiveState(JSON.parse(event.newValue));});}
function form(){const f=document.getElementById('editorForm');f.replaceChildren();for(const [key,label]of Object.entries(labels)){const wrap=document.createElement('div');
    if(['explanation','name','source','sourceNote'].includes(key))wrap.className='wide';
    const l=document.createElement('label');l.htmlFor=key;l.textContent=label;
    const input=document.createElement(['explanation','sourceNote'].includes(key)?'textarea':'input');
    input.id=key;input.value=state[key];input.maxLength=5000;
    if(key==='explanation')input.rows=5;if(key==='sourceNote')input.rows=3;
    input.addEventListener('input',()=>{state[key]=input.value;update();});
    wrap.append(l,input);
    f.append(wrap);}const label=document.createElement('label');label.className='toggle wide';
    const check=document.createElement('input');check.type='checkbox';check.checked=state.showExplanation;
    check.id='showExplanation';check.addEventListener('change',()=>{state.showExplanation=check.checked;
        update();});
        label.append(check,document.createTextNode('Show explanation'));
        f.append(label);}



document.getElementById('editorForm').addEventListener('submit',e=>e.preventDefault());
document.getElementById('buy').addEventListener('click',()=>{document.getElementById('buyNote').textContent='Your product has been added into the cart';});
document.getElementById('download').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});

const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;
a.download='powerbank-stimulus.json';
a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
document.getElementById('status').textContent='Configuration downloaded. Load it here to continue editing.';});


document.getElementById('import').addEventListener('change',async e=>{try{const file=e.target.files[0];
    if(!file)return;if(file.size>100000)throw Error('Configuration file is too large.');
    const next=validated(JSON.parse(await file.text()));
    state=next;form();update();document.getElementById('status').textContent='Configuration loaded.';}catch(err){document.getElementById('status').textContent=err.message;}});

document.querySelector('.spec-title')?.remove();
document.querySelector('.specs')?.remove();
document.querySelector('.caption')?.remove();
document.getElementById('productExplanation').style.marginBottom='0';
document.getElementById('buy').style.marginTop='18px';
document.getElementById('seeWhy').addEventListener('click',()=>{noteOpen=true;render();});
document.getElementById('feedbackSubmit').addEventListener('click', () => {
    const input = document.getElementById('feedbackInput');
    const status = document.getElementById('feedbackStatus');
    const value = input.value.trim();

    if (!value) {
        status.textContent = 'Please enter your feedback before submitting.';
        return;
    }

    status.textContent = 'Thank you for your feedback.';
    input.value = '';
    input.disabled = true;
    document.getElementById('feedbackSubmit').disabled = true;

    // 通知 Qualtrics：可以显示 Next 按钮了
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'feedbackSubmitted' }, '*');
        }
    } catch (e) {}
});


form();render();
if(!participant&&document.modelContext?.registerTool){
    try{Promise.resolve(
        document.modelContext.registerTool({
            name:'configure_stimulus',
            description:'Update the editable power-bank stimulus text and explanation visibility.',
            inputSchema:{type:'object',properties:{explanation:{type:'string'},
            showExplanation:{type:'boolean'},price:{type:'string'},
            name:{type:'string'}},additionalProperties:false},
            annotations:{readOnlyHint:false},
            execute(input){state=validated({...state,...input});
            form();render();
            return {name:state.name,showExplanation:state.showExplanation,price:state.price};}})).catch(()=>{});}catch(e){}}

