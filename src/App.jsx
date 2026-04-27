import { useState, useEffect, useRef } from "react";
import { pdf } from '@react-pdf/renderer';
import AbsovexReportPDF from './AbsovexReportPDF';

const C = {
  primary:'#0D7E7A',mid:'#0A6B68',light:'#35B3B3',pale:'#E8F7F7',mint:'#A8DCDC',
  pink:'#EC008B',pinkLight:'#FF4DAD',pinkPale:'#FCE4F3',
  cream:'#FFFAF3',dark:'#3B3647',
  teal:'#0D7E7A',tealBg:'#E8F7F7',tealBorder:'#A8DCDC',
  amber:'#D97706',amberBg:'#FFFBEB',amberBorder:'#FCD34D',
  orange:'#EA580C',orangeBg:'#FFF7ED',orangeBorder:'#FDBA74',
  sky:'#0284C7',skyBg:'#F0F9FF',skyBorder:'#BAE6FD',
  violet:'#7C3AED',violetBg:'#F5F3FF',violetBorder:'#DDD6FE',
  indigo:'#4338CA',indigoBg:'#EEF2FF',indigoBorder:'#C7D2FE',
  red:'#DC2626',redBg:'#FEF2F2',
  blue:'#1D4ED8',blueBg:'#EFF6FF',blueBorder:'#BFDBFE',
  bg:'#FFFAF3',white:'#FFFFFF',
  g50:'#F9FAFB',g100:'#F3F4F6',g200:'#E5E7EB',g300:'#D1D5DB',
  g400:'#9CA3AF',g500:'#6B7280',g600:'#4B5563',g700:'#374151',g800:'#1F2937',g900:'#111827'
};

const TB = {
  morning_fasting:{label:'Morning - Fasting',color:C.amber,bg:C.amberBg,border:C.amberBorder,time:'Before food or coffee'},
  morning_with_breakfast:{label:'Morning - With Breakfast',color:C.orange,bg:C.orangeBg,border:C.orangeBorder,time:'With your first meal'},
  midday:{label:'Midday / Afternoon',color:C.sky,bg:C.skyBg,border:C.skyBorder,time:'With or between meals'},
  evening_with_dinner:{label:'Evening - With Dinner',color:C.violet,bg:C.violetBg,border:C.violetBorder,time:'With your evening meal'},
  bedtime:{label:'Bedtime',color:C.indigo,bg:C.indigoBg,border:C.indigoBorder,time:'30 min before sleep'},
};

const SEV={
  high:{color:C.red,bg:'#FEF2F2',label:'High Priority'},
  medium:{color:C.amber,bg:'#FFFBEB',label:'Medium'},
  low:{color:C.sky,bg:C.skyBg,label:'Low'}
};

const Ic = {
  person:(c=C.primary)=><svg width={20} height={20} viewBox="0 0 24 24" fill="none"><circle cx={12} cy={8} r={4} stroke={c} strokeWidth={2}/><path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke={c} strokeWidth={2} strokeLinecap="round"/></svg>,
  sun:(c=C.primary)=><svg width={20} height={20} viewBox="0 0 24 24" fill="none"><circle cx={12} cy={12} r={4} stroke={c} strokeWidth={2}/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke={c} strokeWidth={2} strokeLinecap="round"/></svg>,
  coffee:(c=C.primary)=><svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M3 10h13v6a4 4 0 01-4 4H7a4 4 0 01-4-4v-6z" stroke={c} strokeWidth={2}/><path d="M16 12h2a2 2 0 010 4h-2" stroke={c} strokeWidth={2}/><path d="M7 6c0-2 2-2 2-4M11 6c0-2 2-2 2-4" stroke={c} strokeWidth={2} strokeLinecap="round"/></svg>,
  fork:(c=C.primary)=><svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M3 2v7c0 1.1.9 2 2 2h2a2 2 0 002-2V2" stroke={c} strokeWidth={2} strokeLinecap="round"/><path d="M7 11v11" stroke={c} strokeWidth={2} strokeLinecap="round"/><path d="M17 2v20" stroke={c} strokeWidth={2} strokeLinecap="round"/><path d="M14 2v6c0 1.7 1.3 3 3 3s3-1.3 3-3V2" stroke={c} strokeWidth={2} strokeLinecap="round"/></svg>,
  salad:(c=C.primary)=><svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M12 3C7 3 3 7 3 12h18c0-5-4-9-9-9z" stroke={c} strokeWidth={2} strokeLinejoin="round"/><path d="M2 12h20M5 12v6a2 2 0 002 2h10a2 2 0 002-2v-6" stroke={c} strokeWidth={2} strokeLinecap="round"/></svg>,
  plate:(c=C.primary)=><svg width={20} height={20} viewBox="0 0 24 24" fill="none"><circle cx={12} cy={13} r={7} stroke={c} strokeWidth={2}/><circle cx={12} cy={13} r={4} stroke={c} strokeWidth={1.5}/><path d="M8 4h8" stroke={c} strokeWidth={2} strokeLinecap="round"/></svg>,
  moon:(c=C.primary)=><svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bed:(c=C.primary)=><svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M3 9v11M3 13h18M21 9v11" stroke={c} strokeWidth={2} strokeLinecap="round"/><path d="M3 9a4 4 0 014-4h10a4 4 0 014 4" stroke={c} strokeWidth={2} strokeLinecap="round"/><rect x={7} y={7} width={4} height={3} rx={1} stroke={c} strokeWidth={1.5}/></svg>,
  drop:(c=C.primary)=><svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z" stroke={c} strokeWidth={2} strokeLinejoin="round"/></svg>,
  wine:(c=C.primary)=><svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M8 2h8l-2 8a4 4 0 01-8 0L8 2z" stroke={c} strokeWidth={2} strokeLinejoin="round"/><path d="M12 14v6M9 20h6" stroke={c} strokeWidth={2} strokeLinecap="round"/></svg>,
  signal:(c=C.blue)=><svg width={20} height={20} viewBox="0 0 24 24" fill="none"><circle cx={12} cy={12} r={2} fill={c}/><path d="M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7" stroke={c} strokeWidth={2} strokeLinecap="round"/><path d="M5 5a10 10 0 000 14M19 5a10 10 0 010 14" stroke={c} strokeWidth={2} strokeLinecap="round"/></svg>,
  molecule:(c=C.primary)=><svg width={52} height={52} viewBox="0 0 52 52" fill="none"><circle cx={26} cy={26} r={6} stroke={c} strokeWidth={2.5}/><circle cx={10} cy={12} r={4} stroke={C.pink} strokeWidth={2}/><circle cx={42} cy={12} r={4} stroke={C.pink} strokeWidth={2}/><circle cx={10} cy={40} r={4} stroke={C.light} strokeWidth={2}/><circle cx={42} cy={40} r={4} stroke={C.light} strokeWidth={2}/><path d="M14 14l8 9M38 14l-8 9M14 38l8-9M38 38l-8-9" stroke={c} strokeWidth={1.5} strokeLinecap="round"/></svg>,
  check:(c='white')=><svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>,
  lock:(c=C.pink)=><svg width={24} height={24} viewBox="0 0 24 24" fill="none"><rect x={3} y={11} width={18} height={11} rx={2} stroke={c} strokeWidth={2}/><path d="M7 11V7a5 5 0 0110 0v4" stroke={c} strokeWidth={2} strokeLinecap="round"/></svg>,
  download:(c='white')=><svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d="M12 3v13M7 11l5 5 5-5" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20h16" stroke={c} strokeWidth={2} strokeLinecap="round"/></svg>,
  send:(c=C.primary)=><svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

const fmtTime=str=>{
  if(!str)return str;
  return str.replace(/\b(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?\b/g,(match,h,m,mer)=>{
    let hour=parseInt(h),h12,suf;
    if(mer){suf=mer.toUpperCase();h12=hour;}
    else{if(hour===0){h12=12;suf='AM';}else if(hour<12){h12=hour;suf='AM';}else if(hour===12){h12=12;suf='PM';}else{h12=hour-12;suf='PM';}}
    return `${h12}:${m} ${suf}`;
  });
};

// Formats AI timing strings that concatenate time+daypart without separator,
// e.g. "8:00 AMmorning" or "08:00fasting" → "8:00 AM · Morning"
const fmtTiming=str=>{
  if(!str)return str;
  // Insert spaces where digit/AM/PM tokens touch letters directly
  let s=str.replace(/(\d)(AM|PM)([a-zA-Z])/gi,'$1 $2 $3')
           .replace(/(\d)([a-zA-Z])/g,'$1 $2');
  s=fmtTime(s)||s;
  // Insert " · " separator between time and daypart label, capitalize first letter
  s=s.replace(/(\d{1,2}:\d{2}\s*(?:AM|PM))\s*([a-zA-Z])/gi,(_,time,char)=>`${time.trim()} · ${char.toUpperCase()}`);
  return s;
};

const lookupDrug=async(name)=>{
  try{
    const r=await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(name)}&search=1`);
    const d=await r.json();
    const rxcui=d?.idGroup?.rxnormId?.[0]||null;
    let label=null;
    try{
      const r2=await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(name)}"&limit=1`);
      const d2=await r2.json();
      const res=d2?.results?.[0];
      if(res){
        const clean=t=>t?t.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,300):null;
        const parts=[];
        const dos=clean(res.dosage_and_administration?.[0]);
        const war=clean((res.warnings||res.warnings_and_cautions)?.[0]);
        const food=clean(res.food_drug_interactions?.[0]);
        if(dos)parts.push('Dosing: '+dos);
        if(war)parts.push('Warning: '+war);
        if(food)parts.push('Food: '+food);
        if(parts.length)label=parts.join(' | ');
      }
    }catch{}
    return{rxcui,label};
  }catch{return{rxcui:null,label:null};}
};

const TIMING_TIPS={
  levothyroxine:'Empty stomach, 30-60min before breakfast. No calcium, iron, or antacids within 4 hours.',
  synthroid:'Empty stomach, 30-60min before breakfast. No calcium, iron, or antacids within 4 hours.',
  metformin:'Take WITH food to reduce stomach upset.',
  atorvastatin:'Best taken in the evening. Avoid grapefruit.',
  rosuvastatin:'Take any time. Avoid antacids within 2 hours.',
  simvastatin:'Take in the evening. Avoid grapefruit.',
  'vitamin d':'Take with largest meal containing fat.',
  'fish oil':'Take with a fatty meal.',
  'magnesium glycinate':'Best at bedtime - supports sleep.',
  'magnesium citrate':'May cause loose stools - start low.',
  'iron':'Empty stomach with vitamin C. No coffee/tea/calcium within 2 hours.',
  'ferrous':'Empty stomach with vitamin C. No coffee/tea/calcium within 2 hours.',
  'zinc':'Between meals or with small snack.',
  'calcium carbonate':'Take with food.',
  'calcium citrate':'Take any time.',
  'vitamin b12':'Morning, empty stomach preferred.',
  'coq10':'With a fatty meal.',
  ashwagandha:'With food. Evening may support sleep.',
  probiotic:'30min before a meal.',
  melatonin:'30-60min before sleep.',
  omeprazole:'30-60min before first meal.',
  pantoprazole:'30-60min before first meal.',
  sertraline:'Same time daily, with food reduces nausea.',
  escitalopram:'Same time daily, with food reduces nausea.',
  warfarin:'Same time daily. Consistent vitamin K intake.',
  turmeric:'With fat and black pepper for absorption.',
  berberine:'20-30min before meals.',
};

const getTip=name=>{
  const n=name.toLowerCase();
  for(const[k,v]of Object.entries(TIMING_TIPS)){if(n.includes(k))return v;}
  return null;
};

const MED_DB=[
  {name:'Atorvastatin',brand:'Lipitor',type:'medication',dose:'20mg',aliases:'lipitor statin cholesterol'},
  {name:'Rosuvastatin',brand:'Crestor',type:'medication',dose:'10mg',aliases:'crestor statin'},
  {name:'Simvastatin',brand:'Zocor',type:'medication',dose:'20mg',aliases:'zocor statin'},
  {name:'Lisinopril',type:'medication',dose:'10mg',aliases:'prinivil zestril ace blood pressure'},
  {name:'Losartan',brand:'Cozaar',type:'medication',dose:'50mg',aliases:'cozaar arb blood pressure'},
  {name:'Valsartan',brand:'Diovan',type:'medication',dose:'80mg',aliases:'diovan arb blood pressure heart failure'},
  {name:'Amlodipine',brand:'Norvasc',type:'medication',dose:'5mg',aliases:'norvasc calcium channel'},
  {name:'Metoprolol',brand:'Toprol XL',type:'medication',dose:'25mg',aliases:'toprol lopressor beta blocker heart'},
  {name:'Nebivolol',brand:'Bystolic',type:'medication',dose:'5mg',aliases:'bystolic beta blocker blood pressure heart'},
  {name:'Hydrochlorothiazide',type:'medication',dose:'25mg',aliases:'hctz diuretic water pill'},
  {name:'Furosemide',brand:'Lasix',type:'medication',dose:'20mg',aliases:'lasix diuretic'},
  {name:'Warfarin',brand:'Coumadin',type:'medication',dose:'5mg',aliases:'coumadin blood thinner'},
  {name:'Apixaban',brand:'Eliquis',type:'medication',dose:'5mg',aliases:'eliquis blood thinner'},
  {name:'Clopidogrel',brand:'Plavix',type:'medication',dose:'75mg',aliases:'plavix blood thinner'},
  {name:'Aspirin',type:'medication',dose:'81mg',aliases:'asa baby aspirin bayer'},
  {name:'Metformin',brand:'Glucophage',type:'medication',dose:'500mg',aliases:'glucophage diabetes blood sugar'},
  {name:'Metformin ER',brand:'Glucophage XR',type:'medication',dose:'500mg',aliases:'glucophage xr diabetes'},
  {name:'Empagliflozin',brand:'Jardiance',type:'medication',dose:'10mg',aliases:'jardiance diabetes sglt2'},
  {name:'Semaglutide',brand:'Ozempic',type:'medication',dose:'7mg',aliases:'ozempic wegovy rybelsus diabetes glp1'},
  {name:'Levothyroxine',brand:'Synthroid',type:'medication',dose:'25mcg',aliases:'synthroid thyroid t4 hypothyroid'},
  {name:'Levothyroxine',brand:'Synthroid',type:'medication',dose:'50mcg',aliases:'synthroid thyroid t4 hypothyroid'},
  {name:'Levothyroxine',brand:'Synthroid',type:'medication',dose:'75mcg',aliases:'synthroid thyroid t4 hypothyroid'},
  {name:'Levothyroxine',brand:'Synthroid',type:'medication',dose:'88mcg',aliases:'synthroid thyroid t4 hypothyroid'},
  {name:'Levothyroxine',brand:'Synthroid',type:'medication',dose:'100mcg',aliases:'synthroid thyroid t4 hypothyroid'},
  {name:'Levothyroxine',brand:'Synthroid',type:'medication',dose:'112mcg',aliases:'synthroid thyroid t4 hypothyroid'},
  {name:'Levothyroxine',brand:'Synthroid',type:'medication',dose:'125mcg',aliases:'synthroid thyroid t4 hypothyroid'},
  {name:'Levothyroxine',brand:'Synthroid',type:'medication',dose:'137mcg',aliases:'synthroid thyroid t4 hypothyroid'},
  {name:'Levothyroxine',brand:'Synthroid',type:'medication',dose:'150mcg',aliases:'synthroid thyroid t4 hypothyroid'},
  {name:'Levothyroxine',brand:'Synthroid',type:'medication',dose:'175mcg',aliases:'synthroid thyroid t4 hypothyroid'},
  {name:'Levothyroxine',brand:'Synthroid',type:'medication',dose:'200mcg',aliases:'synthroid thyroid t4 hypothyroid'},
  {name:'Levothyroxine',brand:'Synthroid',type:'medication',dose:'300mcg',aliases:'synthroid thyroid t4 hypothyroid'},
  {name:'Liothyronine',brand:'Cytomel',type:'medication',dose:'5mcg',aliases:'cytomel thyroid t3'},
  {name:'Armour Thyroid',type:'medication',dose:'30mg',aliases:'ndt natural desiccated thyroid'},
  {name:'Tibolone',brand:'Livial',type:'medication',dose:'2.5mg',aliases:'tibolona livial hormone hrt menopause postmenopause'},
  {name:'Omeprazole',brand:'Prilosec',type:'medication',dose:'20mg',aliases:'prilosec ppi acid reflux gerd'},
  {name:'Pantoprazole',brand:'Protonix',type:'medication',dose:'40mg',aliases:'protonix ppi acid reflux'},
  {name:'Esomeprazole',brand:'Nexium',type:'medication',dose:'40mg',aliases:'nexium ppi acid'},
  {name:'Famotidine',brand:'Pepcid',type:'medication',dose:'20mg',aliases:'pepcid h2 acid heartburn'},
  {name:'Sertraline',brand:'Zoloft',type:'medication',dose:'50mg',aliases:'zoloft ssri antidepressant depression'},
  {name:'Escitalopram',brand:'Lexapro',type:'medication',dose:'10mg',aliases:'lexapro ssri antidepressant anxiety'},
  {name:'Fluoxetine',brand:'Prozac',type:'medication',dose:'20mg',aliases:'prozac ssri antidepressant'},
  {name:'Venlafaxine',brand:'Effexor',type:'medication',dose:'75mg',aliases:'effexor snri antidepressant'},
  {name:'Duloxetine',brand:'Cymbalta',type:'medication',dose:'30mg',aliases:'cymbalta snri pain'},
  {name:'Bupropion',brand:'Wellbutrin',type:'medication',dose:'150mg',aliases:'wellbutrin antidepressant'},
  {name:'Alprazolam',brand:'Xanax',type:'medication',dose:'0.5mg',aliases:'xanax benzo anxiety'},
  {name:'Clonazepam',brand:'Klonopin',type:'medication',dose:'0.5mg',aliases:'klonopin benzo anxiety'},
  {name:'Quetiapine',brand:'Seroquel',type:'medication',dose:'25mg',aliases:'seroquel antipsychotic sleep'},
  {name:'Lamotrigine',brand:'Lamictal',type:'medication',dose:'25mg',aliases:'lamictal mood stabilizer bipolar'},
  {name:'Amphetamine Salts',brand:'Adderall',type:'medication',dose:'10mg',aliases:'adderall adhd stimulant'},
  {name:'Methylphenidate',brand:'Ritalin',type:'medication',dose:'10mg',aliases:'ritalin concerta adhd'},
  {name:'Ibuprofen',brand:'Advil',type:'medication',dose:'400mg',aliases:'advil motrin nsaid pain'},
  {name:'Acetaminophen',brand:'Tylenol',type:'medication',dose:'500mg',aliases:'tylenol paracetamol pain fever'},
  {name:'Gabapentin',brand:'Neurontin',type:'medication',dose:'300mg',aliases:'neurontin nerve pain'},
  {name:'Pregabalin',brand:'Lyrica',type:'medication',dose:'75mg',aliases:'lyrica nerve pain fibromyalgia'},
  {name:'Prednisone',type:'medication',dose:'10mg',aliases:'corticosteroid steroid inflammation'},
  {name:'Cetirizine',brand:'Zyrtec',type:'medication',dose:'10mg',aliases:'zyrtec antihistamine allergy'},
  {name:'Loratadine',brand:'Claritin',type:'medication',dose:'10mg',aliases:'claritin antihistamine allergy'},
  {name:'Montelukast',brand:'Singulair',type:'medication',dose:'10mg',aliases:'singulair asthma allergy'},
  {name:'Estradiol',brand:'Estrace',type:'medication',dose:'1mg',aliases:'estrace estrogen hrt menopause'},
  {name:'Progesterone',brand:'Prometrium',type:'medication',dose:'100mg',aliases:'prometrium hrt menopause'},
  {name:'Tamoxifen',brand:'Nolvadex',type:'medication',dose:'20mg',aliases:'nolvadex breast cancer'},
  {name:'Alendronate',brand:'Fosamax',type:'medication',dose:'70mg',aliases:'fosamax osteoporosis bone'},
  {name:'Testosterone (TRT)',brand:'Androgel',type:'medication',dose:'50mg',aliases:'androgel testosterone replacement'},
  {name:'Amoxicillin',type:'medication',dose:'500mg',aliases:'antibiotic infection'},
  {name:'Doxycycline',brand:'Vibramycin',type:'medication',dose:'100mg',aliases:'vibramycin antibiotic acne'},
  {name:'Azithromycin',brand:'Zithromax',type:'medication',dose:'250mg',aliases:'zithromax z-pack antibiotic'},
  {name:'Hydroxychloroquine',brand:'Plaquenil',type:'medication',dose:'200mg',aliases:'plaquenil lupus arthritis'},
  {name:'Zolpidem',brand:'Ambien',type:'medication',dose:'5mg',aliases:'ambien sleep insomnia'},
  {name:'Colchicine',brand:'Colcrys',type:'medication',dose:'0.6mg',aliases:'colcrys gout'},
  {name:'Allopurinol',type:'medication',dose:'100mg',aliases:'zyloprim gout uric acid'},
  {name:'Levocetirizine',brand:'Xyzal',type:'medication',dose:'5mg',aliases:'xyzal antihistamine allergy'},
  {name:'MacuHealth (Lutein + Zeaxanthin + Meso-zeaxanthin)',type:'supplement',dose:'1 capsule',aliases:'macuhealth lutein zeaxanthin meso-zeaxanthin eye macular vision'},
  {name:'Vitamin D3',type:'vitamin',dose:'2000 IU',aliases:'cholecalciferol sunshine vitamin d'},
  {name:'Vitamin D3 5000 IU',type:'vitamin',dose:'5000 IU',aliases:'cholecalciferol high dose d3'},
  {name:'Vitamin D3 10000 IU',type:'vitamin',dose:'10000 IU',aliases:'cholecalciferol high dose d3'},
  {name:'Vitamin D3 + K2 (5000 IU/100mcg)',type:'vitamin',dose:'5000 IU/100mcg',aliases:'d3 k2 combo bone heart menaquinone'},
  {name:'Vitamin D3 + K2 (10000 IU/200mcg)',type:'vitamin',dose:'10000 IU/200mcg',aliases:'d3 k2 combo high dose bone heart menaquinone'},
  {name:'Vitamin C',type:'vitamin',dose:'500mg',aliases:'ascorbic acid immune'},
  {name:'Vitamin B12 (Methylcobalamin)',type:'vitamin',dose:'1000mcg',aliases:'methyl b12 energy nerve'},
  {name:'Vitamin B12 (Cyanocobalamin)',type:'vitamin',dose:'1000mcg',aliases:'cyano b12'},
  {name:'Vitamin B6',type:'vitamin',dose:'50mg',aliases:'pyridoxal phosphate b6'},
  {name:'Vitamin B Complex',type:'vitamin',dose:'1 capsule',aliases:'b vitamins energy stress'},
  {name:'Vitamin A',type:'vitamin',dose:'5000 IU',aliases:'retinol eye immune'},
  {name:'Vitamin E',type:'vitamin',dose:'400 IU',aliases:'tocopherol antioxidant'},
  {name:'Vitamin K2 (MK-7)',type:'vitamin',dose:'100mcg',aliases:'menaquinone bone heart k2'},
  {name:'Folate (Methylfolate)',type:'vitamin',dose:'400mcg',aliases:'5-mthf methylated folic acid pregnancy'},
  {name:'Folic Acid',type:'vitamin',dose:'400mcg',aliases:'folate b9 pregnancy'},
  {name:'Biotin',type:'vitamin',dose:'5000mcg',aliases:'b7 hair nails skin'},
  {name:'Niacin (B3)',type:'vitamin',dose:'500mg',aliases:'nicotinic acid cholesterol'},
  {name:'Niacinamide',type:'vitamin',dose:'500mg',aliases:'nicotinamide no-flush skin'},
  {name:'Myo-Inositol',type:'vitamin',dose:'2g',aliases:'pcos fertility insulin'},
  {name:'Magnesium Glycinate',type:'mineral',dose:'400mg',aliases:'chelated magnesium sleep anxiety calm'},
  {name:'Magnesium Citrate',type:'mineral',dose:'400mg',aliases:'magnesium constipation'},
  {name:'Magnesium Malate',type:'mineral',dose:'400mg',aliases:'magnesium energy fibromyalgia'},
  {name:'Magnesium Threonate',type:'mineral',dose:'2g',aliases:'magtein brain cognition blood brain barrier'},
  {name:'Magnesium Taurate',type:'mineral',dose:'400mg',aliases:'heart cardiovascular'},
  {name:'Zinc Picolinate',type:'mineral',dose:'15mg',aliases:'zinc immune'},
  {name:'Iron (Ferrous Sulfate)',type:'mineral',dose:'65mg',aliases:'iron absorption blood'},
  {name:'Iron (Ferrous Bisglycinate)',type:'mineral',dose:'25mg',aliases:'chelated iron gentle'},
  {name:'Copper',type:'mineral',dose:'2mg',aliases:'trace mineral'},
  {name:'Selenium',type:'mineral',dose:'200mcg',aliases:'selenomethionine thyroid immune'},
  {name:'Iodine',type:'mineral',dose:'150mcg',aliases:'potassium iodide thyroid'},
  {name:'Chromium',type:'mineral',dose:'200mcg',aliases:'blood sugar glucose'},
  {name:'Fish Oil Omega-3',type:'supplement',dose:'1000mg',aliases:'epa dha omega 3 heart brain'},
  {name:'Krill Oil',type:'supplement',dose:'1000mg',aliases:'astaxanthin omega 3'},
  {name:'Alpha-Lipoic Acid',type:'supplement',dose:'300mg',aliases:'ala antioxidant blood sugar'},
  {name:'NAC (N-Acetyl Cysteine)',type:'supplement',dose:'600mg',aliases:'acetylcysteine antioxidant glutathione'},
  {name:'Milk Thistle',type:'supplement',dose:'300mg',aliases:'silymarin liver detox'},
  {name:'Spirulina',type:'supplement',dose:'1000mg',aliases:'algae protein detox'},
  {name:'Chlorella',type:'supplement',dose:'1000mg',aliases:'algae detox'},
  {name:'Activated Charcoal',type:'supplement',dose:'500mg',aliases:'detox gas bloating'},
  {name:'Psyllium Husk',type:'supplement',dose:'5g',aliases:'fiber digestion prebiotic'},
  {name:'Slippery Elm',type:'supplement',dose:'400mg',aliases:'digestion gut inflammation'},
  {name:'L-Glutamine',type:'supplement',dose:'5g',aliases:'amino acid gut healing'},
  {name:'Collagen Peptides',type:'supplement',dose:'10g',aliases:'type 1 3 skin joints'},
  {name:'Creatine Monohydrate',type:'supplement',dose:'5g',aliases:'muscle strength cognition'},
  {name:'Beta-Alanine',type:'supplement',dose:'3g',aliases:'endurance muscle'},
  {name:'Whey Protein',type:'supplement',dose:'25g',aliases:'protein muscle'},
  {name:'Ashwagandha (KSM-66)',type:'herb',dose:'600mg',aliases:'stress adapton anxiety cortisol'},
  {name:'Rhodiola Rosea',type:'herb',dose:'300mg',aliases:'adapton energy fatigue'},
  {name:'Holy Basil (Tulsi)',type:'herb',dose:'300mg',aliases:'adapton stress'},
  {name:'Cordyceps',type:'herb',dose:'500mg',aliases:'mushroom energy endurance'},
  {name:'Reishi Mushroom',type:'herb',dose:'500mg',aliases:'mushroom sleep stress adaptogen'},
  {name:'Lion\'s Mane Mushroom',type:'herb',dose:'500mg',aliases:'mushroom brain cognition memory'},
  {name:'Chaga Mushroom',type:'herb',dose:'400mg',aliases:'mushroom immune antioxidant'},
  {name:'Maca Root',type:'herb',dose:'1500mg',aliases:'energy libido fertility hormone'},
  {name:'Ginseng (Panax)',type:'herb',dose:'200mg',aliases:'energy immune cognitive adaptogen'},
  {name:'Ginkgo Biloba',type:'herb',dose:'120mg',aliases:'brain memory circulation cognitive'},
  {name:'Milk Thistle',type:'herb',dose:'150mg',aliases:'liver detox silymarin hepatic'},
  {name:'Valerian Root',type:'herb',dose:'450mg',aliases:'sleep anxiety insomnia'},
  {name:'Elderberry',type:'herb',dose:'500mg',aliases:'immune cold flu sambucus'},
  {name:"St. John's Wort",type:'herb',dose:'300mg',aliases:"st johns wort depression mood anxiety herb hypericum"},
  {name:'Saw Palmetto',type:'herb',dose:'320mg',aliases:'prostate hair loss dht men'},
  {name:'Black Cohosh',type:'herb',dose:'40mg',aliases:'menopause hot flashes women hormone'},
  {name:'Vitex (Chasteberry)',type:'herb',dose:'400mg',aliases:'pms hormone progesterone cycle'},
  {name:'Evening Primrose Oil',type:'herb',dose:'1000mg',aliases:'gla pms menopause skin'},
  {name:'Boswellia',type:'herb',dose:'400mg',aliases:'frankincense anti-inflammatory joint pain'},
  {name:'Bacopa Monnieri',type:'herb',dose:'300mg',aliases:'brain memory cognitive ayurvedic'},
  {name:'Saffron Extract',type:'herb',dose:'30mg',aliases:'mood depression pms appetite'},
  {name:'Black Seed Oil',type:'herb',dose:'1000mg',aliases:'black cumin seed immune nigella'},
];

const TIMING_OPTIONS=['Morning','Noon','Afternoon','Evening','Bedtime'];

// ─── ENRICHMENT LOOKUP TABLES ────────────────────────────────────────────────
const ABSORPTION_DB={
  iron:        {bestTaken:'Empty stomach',requiresFood:false,requiresFat:false,emptyStomachPreferred:true,preferredSolvent:'Water with vitamin C',neverPairWith:['Coffee','Tea','Calcium','Dairy','Antacids','Zinc']},
  ferrous:     {bestTaken:'Empty stomach',requiresFood:false,requiresFat:false,emptyStomachPreferred:true,preferredSolvent:'Water with vitamin C',neverPairWith:['Coffee','Tea','Calcium','Dairy','Antacids','Zinc']},
  levothyroxine:{bestTaken:'30–60 min before breakfast',requiresFood:false,requiresFat:false,emptyStomachPreferred:true,preferredSolvent:'Water only',neverPairWith:['Calcium','Iron','Fiber','Coffee','Antacids','Soy']},
  synthroid:   {bestTaken:'30–60 min before breakfast',requiresFood:false,requiresFat:false,emptyStomachPreferred:true,preferredSolvent:'Water only',neverPairWith:['Calcium','Iron','Fiber','Coffee','Antacids','Soy']},
  metformin:   {bestTaken:'With food',requiresFood:true,requiresFat:false,emptyStomachPreferred:false,preferredSolvent:'Water with meal',neverPairWith:['Alcohol']},
  'vitamin d': {bestTaken:'With largest fatty meal',requiresFood:true,requiresFat:true,emptyStomachPreferred:false,preferredSolvent:'With dietary fat',neverPairWith:[]},
  'fish oil':  {bestTaken:'With a fatty meal',requiresFood:true,requiresFat:true,emptyStomachPreferred:false,preferredSolvent:'With dietary fat',neverPairWith:[]},
  omega:       {bestTaken:'With a fatty meal',requiresFood:true,requiresFat:true,emptyStomachPreferred:false,preferredSolvent:'With dietary fat',neverPairWith:[]},
  magnesium:   {bestTaken:'Evening or bedtime',requiresFood:false,requiresFat:false,emptyStomachPreferred:false,preferredSolvent:'Water',neverPairWith:['Iron','Zinc (high dose)']},
  zinc:        {bestTaken:'Between meals or with small snack',requiresFood:false,requiresFat:false,emptyStomachPreferred:false,preferredSolvent:'Water',neverPairWith:['Iron','Calcium (high dose)']},
  calcium:     {bestTaken:'With food (carbonate) or any time (citrate)',requiresFood:true,requiresFat:false,emptyStomachPreferred:false,preferredSolvent:'Water',neverPairWith:['Iron','Levothyroxine','Zinc']},
  'vitamin b12':{bestTaken:'Morning, empty stomach preferred',requiresFood:false,requiresFat:false,emptyStomachPreferred:true,preferredSolvent:'Water',neverPairWith:[]},
  coq10:       {bestTaken:'With a fatty meal',requiresFood:true,requiresFat:true,emptyStomachPreferred:false,preferredSolvent:'With dietary fat',neverPairWith:[]},
  ashwagandha: {bestTaken:'With food',requiresFood:true,requiresFat:false,emptyStomachPreferred:false,preferredSolvent:'Water or milk',neverPairWith:[]},
  melatonin:   {bestTaken:'30–60 min before sleep',requiresFood:false,requiresFat:false,emptyStomachPreferred:false,preferredSolvent:'Water',neverPairWith:['Caffeine','Alcohol']},
  omeprazole:  {bestTaken:'30–60 min before first meal',requiresFood:false,requiresFat:false,emptyStomachPreferred:true,preferredSolvent:'Water',neverPairWith:[]},
  pantoprazole:{bestTaken:'30–60 min before first meal',requiresFood:false,requiresFat:false,emptyStomachPreferred:true,preferredSolvent:'Water',neverPairWith:[]},
  warfarin:    {bestTaken:'Same time daily',requiresFood:false,requiresFat:false,emptyStomachPreferred:false,preferredSolvent:'Water',neverPairWith:['Vitamin K foods (inconsistent)','NSAIDs']},
  probiotic:   {bestTaken:'30 min before a meal',requiresFood:false,requiresFat:false,emptyStomachPreferred:false,preferredSolvent:'Water',neverPairWith:['Antibiotics (same time)']},
};

const REAL_WORLD_IMPACT_DB={
  iron:        ['Improved energy and reduced fatigue','Better oxygen delivery to muscles and brain','Reduced brain fog from iron-deficiency symptoms'],
  ferrous:     ['Improved energy and reduced fatigue','Better oxygen delivery to muscles and brain'],
  levothyroxine:['More consistent thyroid hormone levels throughout the day','Reduced symptoms of hypothyroidism (fatigue, weight, mood)','Better medication effectiveness at the same dose'],
  synthroid:   ['More consistent thyroid hormone levels throughout the day','Better medication effectiveness at the same dose'],
  metformin:   ['Reduced gastrointestinal side effects','Steadier blood sugar control','Better tolerability with fewer nausea symptoms'],
  'vitamin d': ['Stronger immune response','Better calcium absorption for bone density','Improved mood and seasonal mood support'],
  'fish oil':  ['Improved cardiovascular health markers','Reduced systemic inflammation','Better brain and joint support'],
  magnesium:   ['Deeper, more restful sleep','Reduced muscle tension and nighttime cramps','Calmer nervous system response'],
  zinc:        ['Stronger immune function','Better wound healing and skin repair','Improved hormone and enzyme function'],
  'vitamin b12':['Better energy and reduced fatigue','Improved nerve function and mood','Sharper mental clarity'],
  ashwagandha: ['Reduced cortisol and stress response','Better sustained energy without crash','Improved sleep quality'],
  melatonin:   ['Faster sleep onset','Better circadian rhythm regulation','Reduced grogginess if timed correctly'],
  coq10:       ['Better cellular energy production','Improved cardiovascular support','Reduced fatigue especially with statin use'],
  warfarin:    ['Consistent anticoagulation levels','Reduced risk of under- or over-dosing'],
  omeprazole:  ['Better acid suppression before meals','Reduced GERD symptoms and esophageal exposure'],
  calcium:     ['Improved bone mineral density support','Better absorption when taken with food'],
};

const POSITIVES_DETECTOR=[
  {test:item=>item.name.toLowerCase().includes('magnesium')&&(item.timing||'').toLowerCase().includes('bedtime'),strength:'Magnesium at bedtime',explanation:'Taking magnesium at bedtime aligns with its natural muscle-relaxing and sleep-supporting effects.',impact:'You are getting the maximum sleep benefit from this supplement.'},
  {test:(item,_,all)=>{const n=item.name.toLowerCase();const hasFat=n.includes('vitamin d')||n.includes('fish oil')||n.includes('omega')||n.includes('coq10');const withMeal=(item.timing||'').toLowerCase().includes('dinner')||(item.timing||'').toLowerCase().includes('lunch')||(item.timing||'').toLowerCase().includes('breakfast');return hasFat&&withMeal;},strength:'Fat-soluble supplement taken with a meal',explanation:'Taking fat-soluble vitamins and oils with a meal that contains fat significantly increases absorption.',impact:'You are maximizing absorption of this fat-soluble supplement by pairing it with food.'},
  {test:(item,_,all)=>{const isIron=item.name.toLowerCase().includes('iron')||item.name.toLowerCase().includes('ferrous');if(!isIron)return false;const ca=all.find(i=>i.name.toLowerCase().includes('calcium'));if(!ca)return true;return(item.timing||'')!==(ca.timing||'');},strength:'Iron and calcium taken at different times',explanation:'Iron and calcium compete for the same absorption pathway. Taking them apart prevents significant absorption loss.',impact:'You are avoiding one of the most common mineral absorption conflicts.'},
  {test:item=>item.name.toLowerCase().includes('melatonin')&&(item.timing||'').toLowerCase().includes('bedtime'),strength:'Melatonin at bedtime',explanation:'Melatonin is most effective when taken 30–60 minutes before sleep, aligned with the body\'s natural circadian drop.',impact:'Your melatonin timing supports its natural sleep-signaling role.'},
  {test:item=>item.name.toLowerCase().includes('probiotic')&&((item.timing||'').toLowerCase().includes('morning')||(item.timing||'').toLowerCase().includes('breakfast')),strength:'Probiotic taken before a meal',explanation:'Probiotics survive stomach acid best when taken before eating, when stomach pH is higher.',impact:'Your probiotic timing maximizes the number of live cultures reaching your gut.'},
];

function enrichReportData(result,items,routine){
  const r={...result,schedule:{...result.schedule}};
  const allItems=items||[];
  const getAbs=name=>{const n=(name||'').toLowerCase();for(const[k,v]of Object.entries(ABSORPTION_DB)){if(n.includes(k))return v;}return null;};
  const getImpact=name=>{const n=(name||'').toLowerCase();for(const[k,v]of Object.entries(REAL_WORLD_IMPACT_DB)){if(n.includes(k))return v;}return[];};
  const fmt=t=>{if(!t)return null;const[h,m]=t.split(':');const hr=parseInt(h);return`${hr%12||12}:${m} ${hr<12?'AM':'PM'}`;};

  // 1. absorption_profile on each scheduled item
  Object.keys(r.schedule||{}).forEach(blk=>{
    r.schedule[blk]=(r.schedule[blk]||[]).map(it=>{
      const abs=getAbs(it.name);
      return{...it,absorption_profile:abs||null,real_world_impact:getImpact(it.name),never_pair_with:abs?.neverPairWith||[]};
    });
  });

  // 2. user_context on conflicts and topIssues
  const coffeeLabel=routine?.coffeeTea?`coffee at ${fmt(routine.coffeeTime)||'8:00 AM'}`:'no morning coffee';
  const breakfastLabel=routine?.hasBreakfast!==false?`breakfast around ${fmt(routine.breakfastStart)||'9:00 AM'}`:'no breakfast';
  r.conflicts=(r.conflicts||[]).map(c=>{
    const itemNames=(c.items||[]).join(' and ');
    const key=(c.issue||'').toLowerCase();
    let ctx=`You take ${itemNames}.`;
    if(key.includes('coffee')||key.includes('caffeine'))ctx=`You have ${coffeeLabel}. ${itemNames} is taken around the same time, leaving less than the recommended spacing.`;
    else if(key.includes('calcium')||key.includes('iron'))ctx=`You take both ${itemNames}. Based on your entries, these may be taken close together, which reduces absorption of one or both.`;
    else if(key.includes('empty stomach')||key.includes('food'))ctx=`You have ${breakfastLabel}. Taking ${itemNames} at this time may affect how well it is absorbed.`;
    return{...c,user_context:ctx,absorption_loss_percent:c.penalty>=15?50:c.penalty>=10?30:c.penalty>=5?20:null};
  });
  r.topIssues=(r.topIssues||[]).map(issue=>{
    const txt=(issue.issue||'').toLowerCase();
    let ctx=null;
    if(txt.includes('coffee')||txt.includes('caffeine'))ctx=`You have ${coffeeLabel}. This is relevant to the conflict described.`;
    else if(txt.includes('iron'))ctx=`Iron absorption is highly sensitive to timing. Based on your routine with ${breakfastLabel}, the spacing matters.`;
    else if(txt.includes('empty')||txt.includes('food'))ctx=`Your routine shows ${breakfastLabel}. This timing context affects how this recommendation applies to you.`;
    return{...issue,user_context:ctx};
  });

  // 3. reason_for_move_explained on optimizationLogic
  r.optimizationLogic=(r.optimizationLogic||[]).map(logic=>{
    const abs=getAbs(logic.item);
    const impact=getImpact(logic.item);
    const steps=[];
    if(abs){
      if(abs.emptyStomachPreferred)steps.push(`${logic.item} is best absorbed on an empty stomach, before food and coffee interfere with uptake.`);
      if(abs.requiresFat)steps.push(`${logic.item} is fat-soluble and requires dietary fat for absorption — it should be taken with a meal containing fat.`);
      if(abs.requiresFood&&!abs.requiresFat)steps.push(`${logic.item} should be taken with food to reduce gastrointestinal side effects and improve tolerability.`);
      if(abs.neverPairWith&&abs.neverPairWith.length>0)steps.push(`${abs.neverPairWith.slice(0,2).join(' and ')} can significantly reduce ${logic.item}'s absorption or effectiveness when taken at the same time.`);
    }
    if(logic.reason&&!steps.some(s=>s.includes(logic.reason)))steps.push(logic.reason);
    return{...logic,reason_for_move_explained:steps.length>0?steps:[logic.reason],real_world_benefit:impact.slice(0,2).join(' · ')||null};
  });

  // 4. positives_already_working
  const positives=[];
  POSITIVES_DETECTOR.forEach(det=>{
    allItems.filter(i=>i.name.trim()).forEach(item=>{
      if(det.test(item,routine,allItems)&&!positives.some(p=>p.strength===det.strength))
        positives.push({strength:det.strength,explanation:det.explanation,impact:det.impact});
    });
  });
  [{key:'magnesium',block:'bedtime',strength:'Magnesium at bedtime',explanation:'Taking magnesium at bedtime aligns with its muscle-relaxing and sleep-supporting effects.',impact:'You are getting the maximum sleep benefit from this supplement.'},{key:'melatonin',block:'bedtime',strength:'Melatonin at bedtime',explanation:'Melatonin taken before sleep supports natural circadian rhythm.',impact:'Your melatonin timing is clinically well-aligned.'}].forEach(({key,block,strength,explanation,impact})=>{
    if((r.schedule[block]||[]).some(it=>it.name.toLowerCase().includes(key))&&!positives.some(p=>p.strength===strength))
      positives.push({strength,explanation,impact});
  });
  r.positives_already_working=positives;

  // 5. report_assumptions
  const assumptions=[];
  if(routine?.coffeeTea)assumptions.push({assumption:`You drink coffee around ${fmt(routine.coffeeTime)||'8:00 AM'} every morning.`,whyItMatters:'Coffee affects the absorption of iron, thyroid medications, and several other items.',importance:'high',pharmacistQuestion:'Do you drink coffee every day at this time, or does it vary?'});
  if(routine?.hasBreakfast!==false)assumptions.push({assumption:`You eat breakfast consistently around ${fmt(routine.breakfastStart)||'9:00 AM'}.`,whyItMatters:'Several recommendations are timed relative to your breakfast window.',importance:'high',pharmacistQuestion:'Is your breakfast time consistent, or does it vary by more than 30 minutes?'});
  allItems.filter(i=>i.unrecognized).forEach(i=>assumptions.push({assumption:`"${i.name}" was entered manually and could not be verified in the drug database.`,whyItMatters:'Unverified entries are included using clinical judgment, but interactions may not be fully captured.',importance:'medium',pharmacistQuestion:`Is "${i.name}" the correct name and dose for this item?`}));
  r.report_assumptions=assumptions;

  // 6. Compute real currentScore and optimizedScore from actual stack data.
  // The AI prompt anchors to example values so its scores are unreliable.
  // We derive scores here from the conflict penalties and timing adjustments
  // already present in the parsed data — these are the same numbers driving
  // the report content, so scores and content stay consistent.
  (()=>{
    const conflicts=r.conflicts||[];
    const logic=r.optimizationLogic||[];

    // Total penalty from all conflicts (each conflict has a penalty field)
    const conflictPenalty=conflicts.reduce((s,c)=>s+Math.min(c.penalty||0,20),0);
    // Each item that needed timing adjusted represents a pre-optimization problem
    const timingPenalty=Math.min(logic.length*3,15);

    // Before: start at 88 (a "baseline neutral" well-intentioned but unoptimized stack)
    // and deduct for each real problem found
    const before=Math.max(30,Math.round(88-conflictPenalty-timingPenalty));

    // After: recover 75% of conflict penalties (conflicts are resolved but some
    // interaction risk remains if not followed) plus 3 pts per timing fix
    const after=Math.min(97,Math.max(before+5,Math.round(before+conflictPenalty*0.75+logic.length*3)));

    r.currentScore=before;
    r.optimizedScore=after;

    // 7. Generate scoreBreakdown from real data so Section 7 always has content.
    // Only generate if the AI didn't return a real breakdown.
    if(!(r.scoreBreakdown||[]).length){
      const allScheduled=Object.values(r.schedule||{}).flat();
      const needsFoodPairing=allScheduled.filter(it=>it.absorption_profile?.requiresFat||it.absorption_profile?.requiresFood).length;
      const conflictCap=Math.min(conflictPenalty,30);

      const tBefore=Math.max(8,25-timingPenalty);
      const tAfter=Math.min(25,tBefore+Math.round(timingPenalty*0.9));

      const cBefore=Math.max(5,30-conflictCap);
      const cAfter=Math.min(30,cBefore+Math.round(conflictCap*0.8));

      const fBefore=Math.max(8,20-Math.min(needsFoodPairing*3,12));
      const fAfter=Math.min(20,fBefore+Math.min(needsFoodPairing*2,10));

      const rBefore=Math.max(8,15-Math.min(logic.length*2,7));
      const rAfter=Math.min(15,rBefore+Math.min(logic.length*2,6));

      r.scoreBreakdown=[
        {
          category:'Timing consistency',
          before:tBefore,after:tAfter,maxPoints:25,
          actions_that_improved_score:logic.length>0
            ?logic.slice(0,3).map(l=>`Adjusted timing for ${l.item} to better fit your day`)
            :['Your item timing was already well aligned'],
          why_not_perfect:logic.length>0?'Some timing constraints depend on staying consistent with your routine.':null,
        },
        {
          category:'Conflict spacing',
          before:cBefore,after:cAfter,maxPoints:30,
          actions_that_improved_score:conflicts.length>0
            ?conflicts.slice(0,2).map(c=>`Added spacing between ${(c.items||[]).join(' and ')}`)
            :['No significant spacing conflicts found in your stack'],
          why_not_perfect:conflicts.length>0?'Spacing improvements require following the schedule consistently.':null,
        },
        {
          category:'Food pairing',
          before:fBefore,after:fAfter,maxPoints:20,
          actions_that_improved_score:needsFoodPairing>0
            ?['Placed fat-soluble and food-sensitive items with appropriate meals']
            :['No specific food pairing adjustments needed'],
          why_not_perfect:null,
        },
        {
          category:'Routine fit',
          before:rBefore,after:rAfter,maxPoints:15,
          actions_that_improved_score:['Schedule aligned to your meal times, coffee window, and wake time'],
          why_not_perfect:null,
        },
      ];
    }
  })();

  return r;
}

const NEW_ITEM=id=>({id,name:'',type:'supplement',dose:'',timing:'',timingTimes:{},frequency:'1x day',notes:'',ingredients:'',unrecognized:false,rxcui:null,fdaLabel:null,fetching:false});

const SAMPLE=[
  {id:1,name:'Metformin',type:'medication',dose:'500mg',timing:'Wake (before breakfast)',frequency:'2x day',notes:'',rxcui:null,fdaLabel:null,fetching:false},
  {id:2,name:'Vitamin D3',type:'vitamin',dose:'2000 IU',timing:'Wake (before breakfast)',frequency:'1x day',notes:'',rxcui:null,fdaLabel:null,fetching:false},
  {id:3,name:'Iron (Ferrous Sulfate)',type:'mineral',dose:'65mg',timing:'With Breakfast',frequency:'1x day',notes:'take with coffee',rxcui:null,fdaLabel:null,fetching:false},
  {id:4,name:'Magnesium Glycinate',type:'mineral',dose:'400mg',timing:'With Breakfast',frequency:'1x day',notes:'helps with sleep',rxcui:null,fdaLabel:null,fetching:false},
  {id:5,name:'Fish Oil Omega-3',type:'supplement',dose:'1000mg',timing:'With Dinner',frequency:'1x day',notes:'',rxcui:null,fdaLabel:null,fetching:false},
  {id:6,name:'Ashwagandha (KSM-66)',type:'herb',dose:'600mg',timing:'With Breakfast',frequency:'1x day',notes:'',rxcui:null,fdaLabel:null,fetching:false},
  {id:7,name:'Zinc Picolinate',type:'mineral',dose:'15mg',timing:'With Breakfast',frequency:'1x day',notes:'',rxcui:null,fdaLabel:null,fetching:false},
  {id:8,name:'Vitamin B12 (Methylcobalamin)',type:'vitamin',dose:'1000mcg',timing:'With Breakfast',frequency:'1x day',notes:'',rxcui:null,fdaLabel:null,fetching:false},
];

const DEF_R={sex:'female',age:'',hormonalStage:'',wakeTime:'07:00',coffeeTea:true,coffeeTime:'08:00',hasBreakfast:true,breakfastStart:'09:00',breakfastEnd:'10:00',hasLunch:true,lunchStart:'12:30',lunchEnd:'13:30',hasDinner:true,dinnerTime:'18:00',eveningSnack:false,snackTime:'21:00',bedtime:'23:00',waterGlasses:8,alcoholFrequency:'never',alcoholDrinks:'1-2'};

function StableInput({value,onCommit,placeholder,style}){
  const[v,setV]=useState(value||'');
  useEffect(()=>setV(value||''),[value]);
  return <input type="text" value={v} onChange={e=>setV(e.target.value)} onBlur={()=>onCommit(v)} placeholder={placeholder||''} autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false" style={style||{border:`1px solid ${C.g300}`,borderRadius:8,padding:'11px 13px',fontSize:16,width:'100%',boxSizing:'border-box',outline:'none',background:'white',color:'#111827'}}/>;
}

function NameField({value,onCommit,onSelect,onUnrecognized}){
  const[v,setV]=useState(value||'');
  const pickedFromDB=useRef(false);
  useEffect(()=>setV(value||''),[value]);
  const q=v.trim().toLowerCase();
  const hits=q.length>1?MED_DB.filter(m=>m.name.toLowerCase().includes(q)||(m.aliases||'').toLowerCase().includes(q)).slice(0,7):[];
  const handleBlur=()=>{
    onCommit(v);
    if(pickedFromDB.current){pickedFromDB.current=false;return;}
    if(onUnrecognized&&v.trim().length>2){
      const t=v.trim().toLowerCase();
      const matched=MED_DB.some(m=>{const name=m.name.toLowerCase();const brand=(m.brand||'').toLowerCase();const aliases=(m.aliases||'').toLowerCase();return name.includes(t)||aliases.includes(t)||t.includes(name)||(brand&&t.includes(brand));});
      onUnrecognized(!matched);
    }
  };
  return(
    <div>
      <input type="text" value={v} onChange={e=>setV(e.target.value)} onBlur={handleBlur}
        placeholder="e.g., Levothyroxine, Vitamin D3, Tibolone..."
        autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck="false"
        style={{border:`1px solid ${C.g300}`,borderRadius:8,padding:'11px 13px',fontSize:16,width:'100%',boxSizing:'border-box',outline:'none',background:'white',color:'#111827'}}/>
      {hits.length>0&&(
        <div style={{marginTop:6}}>
          <div style={{fontSize:11,color:C.g400,marginBottom:4,fontWeight:600}}>Quick pick:</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {hits.map(m=>{
              const displayName=m.brand?`${m.name} (${m.brand})`:m.name;
              return(
                <button key={m.name} type="button"
                  onMouseDown={e=>{e.preventDefault();pickedFromDB.current=true;setV(displayName);onSelect({...m,name:displayName,generic:m.name});}}
                  onTouchEnd={e=>{e.preventDefault();pickedFromDB.current=true;setV(displayName);onSelect({...m,name:displayName,generic:m.name});}}
                  style={{background:C.pale,color:C.primary,border:`1px solid ${C.light}`,borderRadius:20,padding:'5px 12px',fontSize:13,cursor:'pointer',fontWeight:600}}>
                  {m.name}{m.brand&&<span style={{fontWeight:500,fontSize:11,color:C.g500}}> ({m.brand})</span>} <span style={{fontWeight:400,fontSize:11,color:C.teal}}>{m.dose}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickAddTable({items,updItem,setItems,onMoreClick,pickDrug,C,fs,TIMING_OPTIONS}){
  const toggleTiming=(id,opt)=>{
    const it=items.find(i=>i.id===id);
    if(!it)return;
    const cur=(it.timing||'').split(',').map(s=>s.trim()).filter(Boolean);
    const sel=cur.includes(opt);
    const next=sel?cur.filter(x=>x!==opt):[...cur,opt];
    const newTimes={...it.timingTimes};
    if(!next.includes(opt))delete newTimes[opt];
    updItem(id,'timingTimes',newTimes);
    updItem(id,'timing',next.join(', '));
  };
  return(
    <div style={{width:'100%'}}>
      <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginBottom:12}}>
        <button disabled title="Coming soon" style={{padding:'10px 14px',minHeight:40,borderRadius:6,border:'1px solid #DDD',background:'white',color:'#808080',fontSize:13,fontWeight:500,cursor:'not-allowed',opacity:0.5,fontFamily:'inherit'}}>📋 Paste a list</button>
        <button onClick={()=>setItems(p=>[...p,NEW_ITEM(Date.now())])} style={{padding:'10px 14px',minHeight:40,borderRadius:6,border:'none',background:C.primary,color:'white',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>+ Add item</button>
      </div>
      {items.map(item=>{
        const selTimes=(item.timing||'').split(',').map(s=>s.trim()).filter(Boolean);
        return(
          <div key={item.id} style={{border:'1px solid #F0F0ED',borderRadius:8,padding:'14px 16px',marginBottom:12,background:'white'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <span style={{fontSize:14,fontWeight:600,color:'#1A1A1A'}}>{item.name||<em style={{color:'#808080',fontStyle:'normal'}}>New item</em>}</span>
              <span style={{fontSize:13,color:'#808080'}}>{[item.dose,item.type,item.frequency].filter(Boolean).join(' • ')}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,flexWrap:'wrap'}}>
              <span style={{fontSize:13,color:'#808080',flexShrink:0}}>When:</span>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {TIMING_OPTIONS.map(opt=>{
                  const sel=selTimes.includes(opt);
                  return(
                    <button key={opt} type="button" onClick={()=>toggleTiming(item.id,opt)}
                      style={{padding:'6px 10px',minHeight:32,borderRadius:999,border:`1px solid ${sel?C.primary:'#DDD'}`,background:sel?C.primary:'white',color:sel?'white':'#808080',fontSize:12,fontWeight:500,cursor:'pointer',whiteSpace:'nowrap',fontFamily:'inherit',lineHeight:1}}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <button onClick={()=>onMoreClick(item.id)}
                style={{background:'none',border:'none',color:C.primary,cursor:'pointer',fontSize:13,fontWeight:500,fontFamily:'inherit'}}>
                More details ▼
              </button>
            </div>
          </div>
        );
      })}
      <button onClick={()=>setItems(p=>[...p,NEW_ITEM(Date.now())])} style={{marginTop:4,background:'none',border:'none',color:C.primary,fontSize:13,fontWeight:500,cursor:'pointer',padding:'8px 0',fontFamily:'inherit'}}>+ Add another item</button>
      <div style={{marginTop:12,borderLeft:`3px solid ${C.primary}`,background:C.tealBg,borderRadius:'0 8px 8px 0',padding:'10px 14px',fontSize:13,color:C.primary}}>
        ✓ Start with the basics. We'll ask for exact times and special instructions only when needed.
      </div>
    </div>
  );
}

function DoseCell({value,onChange,inputSty}){
  const[v,setV]=useState(value||'');
  useEffect(()=>setV(value||''),[value]);
  return <input type="text" value={v} onChange={e=>setV(e.target.value)} onBlur={()=>onChange(v)} placeholder="e.g., 500mg" autoComplete="off" style={inputSty}/>;
}

function DetailPanel({item,onClose,onSave,onDelete,pickDrug,C,fs,TIMING_OPTIONS}){
  const[draft,setDraft]=useState({
    name:item.name,dose:item.dose,type:item.type,
    frequency:item.frequency||'1x day',timing:item.timing||'',
    timingTimes:item.timingTimes||{},ingredients:item.ingredients||'',notes:item.notes||''
  });
  const[nameErr,setNameErr]=useState('');
  const[showKeyInfo,setShowKeyInfo]=useState(true);
  const selTimes=(draft.timing||'').split(',').map(s=>s.trim()).filter(Boolean);
  const showExactTimes=draft.frequency==='2x day'||draft.frequency==='3x day';
  const inputSty={border:'1px solid #DDD',borderRadius:6,padding:'10px 14px',fontSize:13,width:'100%',boxSizing:'border-box',outline:'none',background:'#F5F5F2',color:'#1A1A1A',minHeight:42,WebkitAppearance:'none',fontFamily:'inherit'};
  const selSty={...inputSty,cursor:'pointer',paddingRight:28,backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M6 9l6 6 6-6\' stroke=\'%23808080\' stroke-width=\'2\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',backgroundRepeat:'no-repeat',backgroundPosition:'right 10px center'};
  const labelSty={fontSize:13,fontWeight:500,color:'#1A1A1A',display:'block',marginBottom:6};
  return(
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:200,background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'5vh 16px 16px'}}>
      <div style={{background:'white',borderRadius:16,padding:24,width:'100%',maxWidth:500,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 8px 32px rgba(0,0,0,0.18)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <button onClick={onClose} style={{background:'none',border:'none',color:C.primary,fontSize:14,fontWeight:600,cursor:'pointer',padding:0}}>← Back to stack</button>
          <button onClick={onDelete} style={{background:'none',border:'none',color:C.g400,fontSize:20,cursor:'pointer',padding:'0 4px'}} title="Delete item">🗑</button>
        </div>
        <h3 style={{margin:'0 0 20px',fontSize:18,fontWeight:800,color:C.g900}}>{draft.name||'New Item'}</h3>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div>
            <label style={labelSty}>Name</label>
            <NameField
              value={draft.name}
              onCommit={v=>setDraft(d=>({...d,name:v}))}
              onSelect={m=>{setDraft(d=>({...d,name:m.name,type:m.type||d.type}));pickDrug(item.id,m);}}
              onUnrecognized={()=>{}}/>
            {nameErr&&<p style={{margin:'4px 0 0',fontSize:12,color:'#DC2626'}}>{nameErr}</p>}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div>
              <label style={labelSty}>Dose</label>
              <input type="text" value={draft.dose} onChange={e=>setDraft(d=>({...d,dose:e.target.value}))} placeholder="e.g., 500mg" style={inputSty}/>
            </div>
            <div>
              <label style={labelSty}>Type</label>
              <select value={draft.type} onChange={e=>setDraft(d=>({...d,type:e.target.value}))} style={selSty}>
                {['medication','supplement','vitamin','mineral','herb'].map(o=><option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelSty}>Frequency</label>
            <select value={draft.frequency} onChange={e=>setDraft(d=>({...d,frequency:e.target.value}))} style={selSty}>
              {['1x day','2x day','3x day','Weekly','Monthly','As needed'].map(f=><option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label style={labelSty}>When do you take this?</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {TIMING_OPTIONS.map(opt=>{
                const sel=selTimes.includes(opt);
                return(
                  <button key={opt} type="button" onClick={()=>{
                    const next=sel?selTimes.filter(x=>x!==opt):[...selTimes,opt];
                    const newTimes={...draft.timingTimes};
                    if(!next.includes(opt))delete newTimes[opt];
                    setDraft(d=>({...d,timing:next.join(', '),timingTimes:newTimes}));
                  }} style={{padding:'10px 14px',minHeight:36,borderRadius:999,border:`1px solid ${sel?C.primary:'#DDD'}`,background:sel?C.primary:'white',color:sel?'white':'#808080',fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'inherit',lineHeight:1}}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {showExactTimes&&selTimes.length>0&&(
            <div>
              <label style={labelSty}>Exact time (optional)</label>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {selTimes.map(opt=>(
                  <div key={opt} style={{display:'flex',alignItems:'center',gap:10}}>
                    <label style={{fontSize:14,color:C.g600,fontWeight:600,minWidth:120}}>{opt}</label>
                    <input type="time" value={(draft.timingTimes||{})[opt]||''} onChange={e=>setDraft(d=>({...d,timingTimes:{...d.timingTimes,[opt]:e.target.value}}))} style={{border:`1.5px solid ${C.g200}`,borderRadius:8,padding:'6px 10px',fontSize:14,color:C.g800,background:'white',outline:'none',cursor:'pointer'}}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={labelSty}>Ingredients or active components <span style={{fontWeight:400,color:C.g400}}>(optional)</span></label>
            <textarea value={draft.ingredients} onChange={e=>setDraft(d=>({...d,ingredients:e.target.value}))} placeholder="e.g., Lutein 10mg, Zeaxanthin 2mg" rows={3} style={{...inputSty,resize:'vertical',lineHeight:1.5}}/>
          </div>

          <div>
            <label style={labelSty}>Personal Notes <span style={{fontWeight:400,color:C.g400}}>(optional)</span></label>
            <input type="text" value={draft.notes} onChange={e=>setDraft(d=>({...d,notes:e.target.value}))} placeholder="e.g., makes me nauseous, take with food..." style={inputSty}/>
          </div>

          <div>
            <button onClick={()=>setShowKeyInfo(s=>!s)} style={{background:'none',border:'none',color:C.primary,fontSize:13,fontWeight:600,cursor:'pointer',padding:0,marginBottom:8}}>
              {showKeyInfo?'▼':'▶'} Key info (FDA / Database)
            </button>
            {showKeyInfo&&(
              <div style={{border:`1px solid ${C.g200}`,borderRadius:8,padding:'12px 14px',background:C.g50}}>
                {item.fetching&&<p style={{margin:0,fontSize:13,color:C.blue,fontWeight:600}}>Looking up in FDA database...</p>}
                {!item.fetching&&item.fdaLabel&&<p style={{margin:0,fontSize:13,color:'#1E3A8A',lineHeight:1.6}}>{item.fdaLabel}</p>}
                {!item.fetching&&!item.fdaLabel&&draft.name.length>2&&(
                  <button onClick={()=>pickDrug(item.id,{name:draft.name,type:draft.type,dose:draft.dose})} style={{background:'none',border:`1px solid ${C.blueBorder||C.g300}`,borderRadius:6,padding:'7px 12px',fontSize:12,color:C.blue||C.primary,cursor:'pointer',fontWeight:600}}>
                    Look up "{draft.name}" in FDA database
                  </button>
                )}
                {!item.fetching&&!item.fdaLabel&&draft.name.length<=2&&<p style={{margin:0,fontSize:13,color:C.g400}}>Enter a name above to look up database info.</p>}
              </div>
            )}
          </div>
        </div>

        <button onClick={()=>{
          if(!draft.name.trim()){setNameErr('Name is required.');return;}
          setNameErr('');
          onSave(draft);
        }} style={{marginTop:20,width:'100%',background:C.primary,color:'white',border:'none',borderRadius:10,padding:'13px 0',fontSize:15,fontWeight:700,cursor:'pointer'}}>
          Save changes
        </button>
      </div>
    </div>
  );
}

function Toggle({on,onChange}){
  return <div onClick={()=>onChange(!on)} style={{width:44,height:26,borderRadius:13,background:on?C.teal:C.g300,cursor:'pointer',position:'relative',transition:'background 0.2s',flexShrink:0}}><div style={{position:'absolute',top:3,left:on?21:3,width:20,height:20,borderRadius:'50%',background:'white',transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)'}}/></div>;
}

function TimeInput({value,onChange}){
  const[h,m]=(value||'07:00').split(':');
  const options=[];
  for(let i=0;i<24;i++){
    for(let j=0;j<2;j++){
      const hr=i%12||12;
      const ap=i<12?'AM':'PM';
      const mn=j===0?'00':'30';
      options.push({val:`${String(i).padStart(2,'0')}:${mn}`,label:`${hr}:${mn} ${ap}`});
    }
  }
  const current=`${String(parseInt(h)||0).padStart(2,'0')}:${m==='30'?'30':'00'}`;
  return <select value={current} onChange={e=>onChange(e.target.value)} style={{border:`1.5px solid ${C.g200}`,borderRadius:10,padding:'10px 14px',fontSize:16,color:C.g800,background:'white',outline:'none',cursor:'pointer',WebkitAppearance:'none',minWidth:140}}>
    {options.map(o=><option key={o.val} value={o.val}>{o.label}</option>)}
  </select>;
}

function RRow({icon,title,sub,children,optional}){
  return <div style={{background:'white',borderRadius:14,padding:'18px 20px',marginBottom:10,boxShadow:'0 1px 4px rgba(0,0,0,0.05)',border:`1px solid ${C.g100}`}}>
    <div style={{display:'flex',alignItems:'flex-start',gap:14}}>
      <div style={{width:40,height:40,borderRadius:12,background:C.tealBg,border:`1px solid ${C.tealBorder}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{icon}</div>
      <div style={{flex:1}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontWeight:700,fontSize:15,color:C.g900}}>{title}</span>{optional&&<span style={{fontSize:11,color:C.g400,background:C.g100,padding:'2px 8px',borderRadius:20}}>optional</span>}</div>
        <div style={{fontSize:13,color:C.g500,marginTop:2,lineHeight:1.5}}>{sub}</div>
        <div style={{marginTop:12}}>{children}</div>
      </div>
    </div>
  </div>;
}

function LogoHeader(){
  return(
    <div style={{display:'flex',alignItems:'center'}}>
      <span style={{fontWeight:800,fontSize:20,color:C.primary,letterSpacing:'-0.5px'}}>
        ABS<span style={{color:C.pink}}>O</span>VEX
      </span>
    </div>
  );
}

// ─── COMPONENT: AI CHAT SECTION ─────────────────────────────────────────────
function AIChatSection({a,chat,chatLoad,sendChat,revisionPending,setRevisionPending,runRevision,advisorLocked,interactionCount,reportUpdateUsed,downloadReport,chatEnd}){
  const[chatIn,setChatIn]=useState('');
  const handleSend=()=>{
    if(!chatIn.trim()||chatLoad)return;
    const msg=chatIn.trim();
    setChatIn('');
    sendChat(msg);
  };
  return(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end',flexWrap:'wrap'}}>
        <span style={{fontSize:12,color:C.g500,background:'white',border:`1px solid ${C.g200}`,borderRadius:20,padding:'4px 12px'}}>Questions left: {Math.max(0,15-interactionCount)}</span>
        <span style={{fontSize:12,color:reportUpdateUsed?C.g300:C.teal,background:'white',border:`1px solid ${reportUpdateUsed?C.g200:C.tealBorder}`,borderRadius:20,padding:'4px 12px'}}>Plan updates left: {reportUpdateUsed?0:1}</span>
      </div>
      {revisionPending&&(
        <div style={{background:'#FFF0F8',border:'1px solid #FFADD8',borderRadius:12,padding:'16px',boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
          <p style={{margin:'0 0 12px',fontSize:14,color:C.g800,lineHeight:1.6}}>This will use <strong>your 1 included report update</strong>. Continue?</p>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>setRevisionPending(null)} style={{flex:1,background:'white',border:`1px solid ${C.g200}`,borderRadius:8,padding:'9px',fontSize:13,fontWeight:600,color:C.g600,cursor:'pointer'}}>Cancel</button>
            <button onClick={()=>{const m=revisionPending;setRevisionPending(null);runRevision(m);}} style={{flex:2,background:'#FF4DAD',border:'none',borderRadius:8,padding:'9px',fontSize:13,fontWeight:700,color:'white',cursor:'pointer'}}>Update My Report</button>
          </div>
        </div>
      )}
      <div style={{background:'white',borderRadius:16,padding:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',minHeight:360,maxHeight:460,overflowY:'auto',display:'flex',flexDirection:'column',gap:12}}>
        {chat.map((m,i)=>(
          <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
            <div style={{maxWidth:'80%',padding:'12px 16px',borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px',background:m.role==='user'?C.primary:'white',color:m.role==='user'?'white':C.g800,fontSize:14,lineHeight:1.6,border:m.role==='assistant'?`1px solid ${C.g200}`:undefined,boxShadow:m.role==='assistant'?'0 1px 4px rgba(0,0,0,0.06)':undefined}}>
              {m.role==='assistant'?renderMd(m.content):m.content}
            </div>
          </div>
        ))}
        {chatLoad&&(
          <div style={{display:'flex',justifyContent:'flex-start'}}>
            <div style={{padding:'12px 16px',borderRadius:'16px 16px 16px 4px',background:'white',border:`1px solid ${C.g200}`,fontSize:14,color:C.g400}}>Thinking...</div>
          </div>
        )}
        <div ref={chatEnd}/>
      </div>
      {advisorLocked?(
        <div style={{background:'#FFF0F8',border:'1px solid #FFADD8',borderRadius:12,padding:'14px 16px',textAlign:'center'}}>
          <p style={{margin:'0 0 12px',fontSize:13,color:'#C0186A',fontWeight:600}}>You've completed the included AI review for this report. Your final version is ready to download.</p>
          <button onClick={()=>downloadReport(a)} style={{background:'#FF4DAD',color:'white',border:'none',borderRadius:8,padding:'10px 20px',fontSize:14,fontWeight:700,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:8}}>
            {Ic.download()} Download Final Report
          </button>
        </div>
      ):(
        <>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['Can I take more of these together?','What should stay separated?','What if my breakfast time changes?','How can I simplify this plan?'].map(chip=>(
              <button key={chip} onClick={()=>setChatIn(chip)} style={{background:C.g50,border:`1px solid ${C.g200}`,borderRadius:20,padding:'6px 12px',fontSize:12,color:C.g600,cursor:'pointer',fontWeight:600,transition:'all 0.15s'}}>{chip}</button>
            ))}
          </div>
          <div style={{display:'flex',gap:10,background:'white',padding:12,borderRadius:14,boxShadow:'0 2px 12px rgba(0,0,0,0.06)',border:`1px solid ${C.g200}`}}>
            <input value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&handleSend()} placeholder="Ask about timing, spacing, or what to combine..." style={{flex:1,border:'none',outline:'none',fontSize:14,color:C.g800,background:'transparent'}}/>
            <button onClick={handleSend} disabled={chatLoad||!chatIn.trim()} style={{background:chatIn.trim()&&!chatLoad?C.primary:C.g200,color:chatIn.trim()&&!chatLoad?'white':C.g400,border:'none',borderRadius:10,padding:'10px 14px',cursor:chatIn.trim()&&!chatLoad?'pointer':'default',display:'flex',alignItems:'center',gap:6,fontSize:13,fontWeight:700,transition:'all 0.15s'}}>
              {Ic.send(chatIn.trim()&&!chatLoad?'white':C.g400)}
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── COMPONENT 7: DOWNLOAD BUTTON ───────────────────────────────────────────
function DownloadButton({a,downloadReport,userEmail}){
  const[downloaded,setDownloaded]=useState(false);
  const handleClick=async()=>{await downloadReport(a,'',userEmail);setDownloaded(true);setTimeout(()=>setDownloaded(false),2500);};
  return(
    <button onClick={handleClick} style={{background:downloaded?'#059669':C.primary,color:'white',border:'none',borderRadius:8,padding:'8px 14px',fontSize:13,cursor:'pointer',fontWeight:700,display:'flex',alignItems:'center',gap:6,transition:'background 0.2s'}}>
      {downloaded?'✓ Downloaded!':<>{Ic.download()}Download PDF</>}
    </button>
  );
}

// ─── FULL REPORT: SINGLE SCROLL ─────────────────────────────────────────────
function FullReport({a,routine,expandedScheduleItem,setExpandedScheduleItem,expandedConflict,setExpandedConflict,expandedScore,setExpandedScore,chat,chatLoad,sendChat,revisionPending,setRevisionPending,runRevision,advisorLocked,interactionCount,reportUpdateUsed,downloadReport,chatEnd}){
  const[expandedAudit,setExpandedAudit]=useState(null);
  const delta=(a.optimizedScore||0)-(a.currentScore||0);
  const wins=a.topWins||a.topBenefits||[];
  const IcTarget=<svg width={28} height={28} viewBox="0 0 24 24" fill="none"><circle cx={12} cy={12} r={9} stroke="white" strokeWidth={2}/><circle cx={12} cy={12} r={5} stroke="white" strokeWidth={2}/><circle cx={12} cy={12} r={1} fill="white"/></svg>;
  const IcArrows=<svg width={28} height={28} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M15 8l4 4-4 4M9 8l-4 4 4 4" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const IcClock=<svg width={28} height={28} viewBox="0 0 24 24" fill="none"><circle cx={12} cy={12} r={9} stroke="white" strokeWidth={2}/><path d="M12 7v5l3 3" stroke="white" strokeWidth={2} strokeLinecap="round"/></svg>;
  const IcClipboard=<svg width={28} height={28} viewBox="0 0 24 24" fill="none"><rect x={8} y={2} width={8} height={4} rx={1} stroke="white" strokeWidth={2}/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="white" strokeWidth={2}/><path d="M9 12h6M9 16h4" stroke="white" strokeWidth={2} strokeLinecap="round"/></svg>;
  const IcAlert=<svg width={28} height={28} viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const IcBulb=<svg width={28} height={28} viewBox="0 0 24 24" fill="none"><path d="M9 21h6M12 3a6 6 0 016 6c0 2.4-1.4 4.5-3.5 5.5L14 17h-4l-.5-2.5C7.4 13.5 6 11.4 6 9a6 6 0 016-6z" stroke="white" strokeWidth={2} strokeLinecap="round"/></svg>;
  const IcChart=<svg width={28} height={28} viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18" stroke="white" strokeWidth={2} strokeLinecap="round"/><path d="M7 16l4-4 4 4 5-5" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const IcStar=<svg width={28} height={28} viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const Chevron=({open})=><svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{transform:open?'rotate(180deg)':'none',transition:'transform 0.2s',flexShrink:0}}><path d="M6 9l6 6 6-6" stroke={C.g400} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const PageHdr=({num,title,sub,icon,magenta})=>(
    <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:20}}>
      <div style={{width:52,height:52,borderRadius:14,background:magenta?C.pink:C.primary,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:`0 4px 12px ${magenta?'rgba(236,0,139,0.3)':'rgba(13,126,122,0.3)'}`}}>{icon}</div>
      <div>
        <div style={{fontSize:10,fontWeight:700,color:C.g400,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:2}}>Section {num}</div>
        <div style={{fontSize:19,fontWeight:800,color:C.g900,lineHeight:1.2}}>{title}</div>
        {sub&&<div style={{fontSize:13,color:C.g500,marginTop:3}}>{sub}</div>}
      </div>
    </div>
  );
  const Card=({children,style={}})=><div style={{background:'white',borderRadius:20,padding:'24px',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',border:`1px solid ${C.g200}`,marginBottom:24,...style}}>{children}</div>;
  const scheduleItems=[];
  Object.entries(a.schedule||{}).forEach(([k,arr])=>{(arr||[]).forEach(it=>scheduleItems.push({...it,block:k}));});
  const changedNames=new Set((a.optimizationLogic||[]).map(o=>(o.item||'').toLowerCase()));
  const unchanged=scheduleItems.filter(it=>!changedNames.has((it.name||'').toLowerCase()));
  const changed=scheduleItems.filter(it=>changedNames.has((it.name||'').toLowerCase()));
  return(
    <div>
      {/* ── PAGE 1: Summary & Score Snapshot ── */}
      <Card>
        <PageHdr num={1} title="Summary & Score Snapshot" sub="Your personalized timing and absorption analysis" icon={IcTarget}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16,padding:'24px 0',borderTop:`1px solid ${C.g100}`,borderBottom:`1px solid ${C.g100}`,marginBottom:a.scoreSummary?12:20}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:62,fontWeight:900,color:C.g400,lineHeight:1}}>{a.currentScore}</div>
            <div style={{fontSize:11,color:C.g400,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginTop:4}}>Current</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
            <svg width={36} height={18} viewBox="0 0 36 18"><path d="M0 9 L28 9 M22 3 L28 9 L22 15" stroke={C.pink} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div style={{background:C.tealBg,color:C.teal,fontSize:14,fontWeight:800,padding:'4px 14px',borderRadius:20,border:`1px solid ${C.tealBorder}`}}>+{delta} pts</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:62,fontWeight:900,color:C.primary,lineHeight:1}}>{a.optimizedScore}</div>
            <div style={{fontSize:11,color:C.primary,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginTop:4}}>Optimized</div>
          </div>
        </div>
        {a.scoreSummary&&(
          <div style={{fontSize:13,color:C.g600,lineHeight:1.6,marginBottom:20,paddingTop:4,textAlign:'center',fontStyle:'italic'}}>{a.scoreSummary}</div>
        )}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {wins.slice(0,3).length>0&&(
            <div style={{background:C.tealBg,borderRadius:12,padding:'14px 16px',border:`1px solid ${C.tealBorder}`}}>
              <div style={{fontSize:11,fontWeight:800,color:C.teal,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>Biggest Improvements</div>
              {wins.slice(0,3).map((w,i)=>(
                <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:i<2?6:0}}>
                  <div style={{width:18,height:18,borderRadius:'50%',background:C.primary,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>{Ic.check()}</div>
                  <div style={{fontSize:13,color:C.dark,lineHeight:1.5}}>{typeof w==='string'?w:(w.title||w.item||w.win||'')}</div>
                </div>
              ))}
            </div>
          )}
          {(a.conflicts||[]).slice(0,3).length>0&&(
            <div style={{background:C.orangeBg,borderRadius:12,padding:'14px 16px',border:`1px solid ${C.orangeBorder}`}}>
              <div style={{fontSize:11,fontWeight:800,color:C.orange,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>Key Issues Found</div>
              {(a.conflicts||[]).slice(0,3).map((c,i)=>(
                <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:i<2?6:0}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:C.orange,marginTop:5,flexShrink:0}}/>
                  <div style={{fontSize:13,color:C.dark,lineHeight:1.5}}>{(c.items||[]).join(' + ')}</div>
                </div>
              ))}
            </div>
          )}
          {(a.positives_already_working||[]).slice(0,3).length>0&&(
            <div style={{background:'#F0FDF4',borderRadius:12,padding:'14px 16px',border:'1px solid #BBF7D0'}}>
              <div style={{fontSize:11,fontWeight:800,color:'#059669',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>What Checked Out Well</div>
              {(a.positives_already_working||[]).slice(0,3).map((p,i)=>(
                <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:i<2?6:0}}>
                  <div style={{width:18,height:18,borderRadius:'50%',background:'#059669',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>{Ic.check()}</div>
                  <div style={{fontSize:13,color:C.dark,lineHeight:1.5}}>{typeof p==='string'?p:(p.strength||p.item||p)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',marginTop:20,marginBottom:12}}>
          {['Timing','Food pairing','Spacing conflicts','Routine fit'].map(chip=>(
            <span key={chip} style={{background:C.tealBg,color:C.teal,fontSize:12,fontWeight:700,padding:'4px 12px',borderRadius:20,border:`1px solid ${C.tealBorder}`}}>{chip}</span>
          ))}
        </div>
        <div style={{padding:'10px 16px',background:C.g50,borderRadius:10,border:`1px solid ${C.g200}`,textAlign:'center'}}>
          <div style={{fontSize:13,color:C.g500}}>See what changed and why ↓</div>
        </div>
      </Card>

      {/* ── PAGE 2: Before vs After ── */}
      <Card>
        <PageHdr num={2} title="Before vs After Breakdown" sub="Our suggested changes to your routine, and why they matter" icon={IcArrows}/>
        {(a.optimizationLogic||[]).length===0?(
          <div style={{textAlign:'center',color:C.g500,fontSize:14,padding:'20px 0'}}>No timing changes were required — your routine was already well-optimized.</div>
        ):(a.optimizationLogic||[]).map((o,i)=>(
          <div key={i} style={{borderBottom:i<(a.optimizationLogic.length-1)?`1px solid ${C.g100}`:'none',paddingBottom:i<(a.optimizationLogic.length-1)?20:0,marginBottom:i<(a.optimizationLogic.length-1)?20:0}}>
            <div style={{fontSize:14,fontWeight:800,color:C.g900,marginBottom:10}}>{o.item}</div>
            <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12,flexWrap:'wrap'}}>
              <div style={{background:C.g100,borderRadius:8,padding:'8px 14px',flex:1,minWidth:120}}>
                <div style={{fontSize:10,color:C.g500,fontWeight:700,textTransform:'uppercase',marginBottom:4}}>Before</div>
                <div style={{fontSize:13,color:C.g700,fontWeight:600}}>{fmtTiming(o.oldTiming)||'Previous timing'}</div>
              </div>
              <svg width={24} height={14} viewBox="0 0 24 14"><path d="M0 7 L18 7 M12 2 L18 7 L12 12" stroke={C.pink} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div style={{background:C.tealBg,borderRadius:8,padding:'8px 14px',flex:1,minWidth:120,border:`1px solid ${C.tealBorder}`}}>
                <div style={{fontSize:10,color:C.teal,fontWeight:700,textTransform:'uppercase',marginBottom:4}}>After</div>
                <div style={{fontSize:13,color:C.primary,fontWeight:600}}>{fmtTiming(o.newTiming)||'Optimized timing'}</div>
              </div>
            </div>
            {o.reason&&(
              <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                <div style={{width:4,borderRadius:2,background:C.primary,alignSelf:'stretch',flexShrink:0}}/>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:C.g500,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>Why we changed it</div>
                  <div style={{fontSize:13,color:C.g700,lineHeight:1.6}}>{o.reason}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </Card>

      {/* ── PAGE 3: Optimized Daily Schedule ── */}
      <Card>
        <PageHdr num={3} title="Your Optimized Daily Schedule" sub="Your personalized daily timing plan" icon={IcClock}/>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {Object.entries(a.schedule||{}).map(([k,sitems])=>{
            if(!sitems||sitems.length===0)return null;
            const b=TB[k];if(!b)return null;
            return(
              <div key={k} style={{borderRadius:14,overflow:'hidden',border:`1px solid ${b.border}`}}>
                <div style={{background:b.bg,padding:'12px 16px',borderBottom:`1px solid ${b.border}`,display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:b.color,flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:800,color:b.color}}>{b.label}</div>
                    <div style={{fontSize:11,color:b.color,opacity:0.7}}>{b.time}</div>
                  </div>
                </div>
                {sitems.map((it,i)=>{
                  const key=`${k}-${i}`;
                  const isOpen=expandedScheduleItem===key;
                  const abs=it.absorption_profile;
                  return(
                    <div key={i} style={{background:'white',borderBottom:i<sitems.length-1?`1px solid ${C.g100}`:'none'}}>
                      <div onClick={()=>setExpandedScheduleItem(prev=>prev===key?null:key)} style={{padding:'14px 16px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:14,fontWeight:700,color:C.g900}}>{it.name}</div>
                          {it.dose&&<div style={{fontSize:12,color:C.g500,marginTop:1}}>{it.dose}</div>}
                          <div style={{fontSize:12,color:C.g600,marginTop:4,lineHeight:1.5}}>{fmtTime(it.instruction)}</div>
                          {!isOpen&&<div style={{fontSize:11,color:C.g400,marginTop:4}}>Tap for timing details</div>}
                        </div>
                        <Chevron open={isOpen}/>
                      </div>
                      {isOpen&&(
                        <div style={{background:C.g50,padding:'14px 16px',borderTop:`1px solid ${C.g100}`}}>
                          {abs&&(
                            <div style={{marginBottom:12}}>
                              <div style={{fontSize:11,fontWeight:800,color:C.g500,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Absorption Profile</div>
                              {abs.bestTaken&&<div style={{fontSize:13,color:C.g700,marginBottom:4}}><strong>Best taken:</strong> {fmtTime(abs.bestTaken)}</div>}
                              {abs.preferredSolvent&&<div style={{fontSize:13,color:C.g700,marginBottom:8}}><strong>Take with:</strong> {abs.preferredSolvent}</div>}
                              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                                {abs.requiresFood&&<span style={{background:C.amberBg,color:C.amber,fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20,border:`1px solid ${C.amberBorder}`}}>Requires food</span>}
                                {abs.requiresFat&&<span style={{background:C.orangeBg,color:C.orange,fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20,border:`1px solid ${C.orangeBorder}`}}>Requires dietary fat</span>}
                                {abs.emptyStomachPreferred&&<span style={{background:C.skyBg,color:C.sky,fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20,border:`1px solid ${C.skyBorder}`}}>Empty stomach preferred</span>}
                              </div>
                            </div>
                          )}
                          {(it.reason_for_move_explained||(it.reason?[it.reason]:[])).filter(Boolean).length>0&&(
                            <div style={{marginBottom:12}}>
                              <div style={{fontSize:11,fontWeight:800,color:C.g500,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Why it's here</div>
                              {(it.reason_for_move_explained||(it.reason?[it.reason]:[])).filter(Boolean).map((step,si)=>(
                                <div key={si} style={{fontSize:13,color:C.g700,lineHeight:1.6,marginBottom:4,paddingLeft:10,borderLeft:`2px solid ${si===0?C.primary:C.g300}`}}>{step}</div>
                              ))}
                            </div>
                          )}
                          {(it.real_world_impact||[]).length>0&&(
                            <div style={{marginBottom:12}}>
                              <div style={{fontSize:11,fontWeight:800,color:'#059669',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>What you'll notice</div>
                              {(it.real_world_impact||[]).map((imp,ii)=>(
                                <div key={ii} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:3}}>
                                  <div style={{color:'#059669',fontWeight:700,flexShrink:0}}>✓</div>
                                  <div style={{fontSize:13,color:C.g700,lineHeight:1.5}}>{imp}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          {(it.never_pair_with||[]).length>0&&(
                            <div style={{background:'#FFF7ED',borderRadius:8,padding:'10px 12px',border:`1px solid ${C.orangeBorder}`}}>
                              <div style={{fontSize:11,fontWeight:800,color:C.orange,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Don't pair with</div>
                              <div style={{fontSize:13,color:C.g700}}>{(it.never_pair_with||[]).join(', ')}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── PAGE 4: Full Stack Timing Audit ── */}
      <Card>
        <PageHdr num={4} title="Full Stack Timing Audit" sub="Every item reviewed for timing, spacing, and routine fit" icon={IcClipboard}/>
        <div style={{background:C.tealBg,borderRadius:10,padding:'12px 16px',border:`1px solid ${C.tealBorder}`,marginBottom:20,fontSize:13,color:C.mid,lineHeight:1.6}}>
          Every item in your stack was reviewed for timing fit, food needs, spacing, and common blockers.
        </div>
        {unchanged.length>0&&(
          <div style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:800,color:'#059669',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>✓ No Changes Needed ({unchanged.length} items)</div>
            {unchanged.map((it,i)=>(
              <div key={i} style={{display:'flex',gap:10,alignItems:'center',padding:'10px 0',borderBottom:i<unchanged.length-1?`1px solid ${C.g100}`:'none'}}>
                <div style={{width:24,height:24,borderRadius:'50%',background:'#F0FDF4',border:'1px solid #BBF7D0',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#059669" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:C.g800}}>{it.name}</div>
                  <div style={{fontSize:12,color:C.g500}}>{it.instruction}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {changed.length>0&&(
          <div>
            <div style={{fontSize:12,fontWeight:800,color:C.amber,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>⟳ Timing Adjusted ({changed.length} items)</div>
            {changed.map((it,i)=>{
              const logic=(a.optimizationLogic||[]).find(o=>(o.item||'').toLowerCase()===(it.name||'').toLowerCase());
              const isOpen=expandedAudit===i;
              return(
                <div key={i} style={{borderBottom:i<changed.length-1?`1px solid ${C.g100}`:'none'}}>
                  <div onClick={()=>setExpandedAudit(p=>p===i?null:i)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',cursor:'pointer'}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:C.g800}}>{it.name}</div>
                      {logic&&<div style={{fontSize:12,color:C.amber,marginTop:2}}>{fmtTiming(logic.oldTiming)} → {fmtTiming(logic.newTiming)}</div>}
                    </div>
                    <Chevron open={isOpen}/>
                  </div>
                  {isOpen&&logic&&(
                    <div style={{background:C.amberBg,borderRadius:8,padding:'10px 12px',marginBottom:8,border:`1px solid ${C.amberBorder}`}}>
                      <div style={{fontSize:10,fontWeight:800,color:C.amber,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Timing Tip</div>
                      <div style={{fontSize:13,color:C.dark,lineHeight:1.6}}>{logic.reason}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div style={{marginTop:20,background:C.g50,borderRadius:10,padding:'14px 16px',border:`1px solid ${C.g200}`}}>
          <div style={{display:'flex',gap:20,flexWrap:'wrap',justifyContent:'space-around'}}>
            <div style={{textAlign:'center'}}><div style={{fontSize:22,fontWeight:800,color:C.primary}}>{scheduleItems.length}</div><div style={{fontSize:11,color:C.g500}}>items reviewed</div></div>
            <div style={{textAlign:'center'}}><div style={{fontSize:22,fontWeight:800,color:C.amber}}>{changed.length}</div><div style={{fontSize:11,color:C.g500}}>adjustments made</div></div>
            <div style={{textAlign:'center'}}><div style={{fontSize:22,fontWeight:800,color:'#059669'}}>+{delta}</div><div style={{fontSize:11,color:C.g500}}>score improvement</div></div>
          </div>
        </div>
      </Card>

      {/* ── PAGE 5: Top Conflicts ── */}
      <Card>
        <PageHdr num={5} title="Top Conflicts & Why They Matter" sub="The biggest timing conflicts we found, and how to fix them" icon={IcAlert} magenta/>
        {(a.conflicts||[]).length===0?(
          <div style={{textAlign:'center',padding:'20px 0'}}>
            <div style={{width:52,height:52,borderRadius:'50%',background:'#F0FDF4',border:'2px solid #BBF7D0',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}><svg width={24} height={24} viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#059669" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <div style={{fontSize:15,fontWeight:700,color:'#059669',marginBottom:4}}>No conflicts detected</div>
            <div style={{fontSize:13,color:C.g500}}>Your routine is already well-optimized.</div>
          </div>
        ):(a.conflicts||[]).slice(0,5).map((c,i)=>{
          const sev=SEV[c.severity]||SEV.medium;
          const isOpen=expandedConflict===i;
          return(
            <div key={i} style={{border:`1px solid ${sev.color}40`,borderRadius:14,overflow:'hidden',marginBottom:i<Math.min((a.conflicts||[]).length,5)-1?16:0}}>
              <div onClick={()=>setExpandedConflict(prev=>prev===i?null:i)} style={{padding:'16px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'flex-start',background:sev.bg,gap:8}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8,flexWrap:'wrap'}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:sev.color,flexShrink:0}}/>
                    <span style={{fontSize:11,fontWeight:800,color:sev.color,textTransform:'uppercase',letterSpacing:'0.06em'}}>{sev.label}</span>
                    <span style={{fontSize:11,fontWeight:700,color:C.red,background:'white',padding:'2px 8px',borderRadius:20,border:'1px solid #FECACA'}}>-{c.penalty} pts</span>
                  </div>
                  <div style={{fontSize:15,fontWeight:700,color:C.g900,marginBottom:4}}>{(c.items||[]).join(' + ')}</div>
                  {!isOpen&&c.user_context&&<div style={{fontSize:12,color:C.g500,fontStyle:'italic',lineHeight:1.5}}>{c.user_context}</div>}
                </div>
                <Chevron open={isOpen}/>
              </div>
              {isOpen&&(
                <div style={{padding:'16px',background:'white',borderTop:`1px solid ${sev.color}30`}}>
                  {c.user_context&&<p style={{margin:'0 0 12px',fontSize:13,color:C.g500,fontStyle:'italic',lineHeight:1.6}}>{c.user_context}</p>}
                  <div style={{fontSize:10,fontWeight:800,color:C.g600,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>What's happening</div>
                  <p style={{margin:'0 0 14px',fontSize:14,color:C.g700,lineHeight:1.6}}>{c.issue}</p>
                  {c.absorption_loss_percent&&(
                    <div style={{background:C.redBg,borderRadius:10,padding:'14px 16px',marginBottom:14,border:'1px solid #FECACA'}}>
                      <div style={{fontSize:32,fontWeight:900,color:C.red,lineHeight:1}}>~{c.absorption_loss_percent}%</div>
                      <div style={{fontSize:12,fontWeight:700,color:C.red,marginTop:2}}>Estimated impact</div>
                      <div style={{fontSize:12,color:'#991B1B',marginTop:8,lineHeight:1.5}}>This timing may reduce how much of the dose your body is able to use, which can make the medication less effective than intended.</div>
                    </div>
                  )}
                  <div style={{background:C.tealBg,borderRadius:10,padding:'12px 14px',border:`1px solid ${C.tealBorder}`}}>
                    <div style={{fontSize:10,fontWeight:800,color:C.teal,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>The Fix</div>
                    <div style={{fontSize:13,color:C.mid,lineHeight:1.5,fontWeight:500}}>{c.recommendation}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Card>

      {/* ── PAGE 6: What Shaped Your Plan ── */}
      <Card>
        <PageHdr num={6} title="What Shaped Your Plan" sub="Here's what Absovex looked at when building your schedule" icon={IcBulb}/>
        <div style={{background:C.tealBg,borderRadius:10,padding:'14px 16px',marginBottom:20,border:`1px solid ${C.tealBorder}`,fontSize:14,color:C.mid,lineHeight:1.7}}>
          {routine&&routine.coffeeTea&&routine.coffeeTime
            ? `Your plan was shaped most by your ${fmtTime(routine.coffeeTime)} coffee, your breakfast timing, and the spacing needed between interacting items.`
            : routine&&(routine.breakfastStart||routine.wakeTime)
            ? 'Your plan was shaped most by your morning routine, meal timing, and the spacing needed between interacting items.'
            : 'Your plan was shaped by your daily routine, meal timing, and the spacing needed between items in your stack.'
          }
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          {[
            ...(routine&&routine.coffeeTea?[{label:'Coffee timing',value:'Your coffee window made it important to protect timing-sensitive items first thing in the morning.',color:C.amber}]:[]),
            {label:'Meal timing',value:'Your breakfast and lunch schedule helped place vitamins and minerals more effectively.',color:C.teal},
            ...((a.conflicts||[]).length>0?[{label:'Spacing rules',value:'Some items needed more space between them to reduce interference.',color:C.orange}]:[]),
            ...(scheduleItems.some(it=>it.absorption_profile?.requiresFat)?[{label:'Food pairing',value:'Fat-soluble items were moved to meals that include fat to support better absorption.',color:C.sky}]:[]),
            {label:'Routine fit',value:'Your wake time and meal timing were used to build a plan that is easier to follow each day.',color:C.violet},
          ].map((row,i,arr)=>(
            <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'14px 0',borderBottom:i<arr.length-1?`1px solid ${C.g100}`:'none'}}>
              <div style={{width:10,height:10,borderRadius:'50%',background:row.color,marginTop:4,flexShrink:0}}/>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:C.g800,marginBottom:2}}>{row.label}</div>
                <div style={{fontSize:13,color:C.g500,lineHeight:1.5}}>{row.value}</div>
              </div>
            </div>
          ))}
        </div>
        {(a.routineInsights||[]).length>0&&(
          <div style={{marginTop:16}}>
            <div style={{fontSize:11,fontWeight:800,color:C.g500,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>What helped this plan work well</div>
            {(a.routineInsights||[]).map((insight,i)=>(
              <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:8}}>
                <div style={{color:C.teal,fontWeight:700,flexShrink:0}}>•</div>
                <div style={{fontSize:13,color:C.g600,lineHeight:1.5}}>{typeof insight==='string'?insight:(insight.insight||insight)}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── PAGE 7: Score Breakdown ── */}
      <Card>
        <PageHdr num={7} title="Health Stack Score Breakdown" sub="See what your score reflects" icon={IcChart}/>
        <div style={{background:C.tealBg,borderRadius:10,padding:'12px 16px',border:`1px solid ${C.tealBorder}`,marginBottom:20,fontSize:13,color:C.mid,lineHeight:1.6}}>
          Your Health Stack Score reflects how well your routine supports timing, spacing, food pairing, and fit with your daily routine.
        </div>
        {(a.scoreBreakdown||[]).length===0?(
          <div>
            {[
              {label:'Timing',desc:(a.optimizationLogic||[]).length>0?`Improved by adjusting timing for ${(a.optimizationLogic||[]).map(o=>o.item).slice(0,2).join(' and ')} to better fit your morning routine`:'Improved by adjusting item timing to better fit your routine'},
              {label:'Spacing',desc:(a.conflicts||[]).length>0?`Improved by creating more distance between items that were too close together`:'Improved by applying spacing rules between interacting items'},
              {label:'Food pairing',desc:'Improved by pairing fat-soluble items with meals that include fat'},
              {label:'Routine fit',desc:'Improved by aligning the plan with your meal and coffee timing'},
            ].map((row,i)=>(
              <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'14px 0',borderBottom:i<3?`1px solid ${C.g100}`:'none'}}>
                <div style={{width:10,height:10,borderRadius:'50%',background:C.primary,marginTop:4,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:700,color:C.g800}}>{row.label}</span>
                    {i===0&&delta>0&&<span style={{fontSize:12,fontWeight:800,color:'#059669',background:'#F0FDF4',padding:'2px 8px',borderRadius:20,border:'1px solid #BBF7D0'}}>+{delta} pts total</span>}
                  </div>
                  <div style={{fontSize:13,color:C.g500,lineHeight:1.5}}>{row.desc}</div>
                </div>
              </div>
            ))}
            <div style={{marginTop:16,background:C.g50,borderRadius:10,padding:'12px 16px',border:`1px solid ${C.g200}`,fontSize:13,color:C.g600,lineHeight:1.6}}>Your score improved most in spacing and food pairing.</div>
          </div>
        ):(a.scoreBreakdown||[]).map((entry,i)=>{
          const isOpen=expandedScore===i;
          const before=entry.before??entry.currentScore??0;
          const after=entry.after??entry.optimizedScore??0;
          const d2=after-before;
          const max=entry.maxPoints||20;
          const beforePct=Math.min(100,(before/max)*100);
          const gainPct=Math.min(100-beforePct,Math.max(0,((after-before)/max)*100));
          return(
            <div key={i} style={{border:`1px solid ${C.g200}`,borderRadius:14,overflow:'hidden',marginBottom:i<(a.scoreBreakdown.length-1)?12:0}}>
              <div onClick={()=>setExpandedScore(prev=>prev===i?null:i)} style={{padding:'14px 16px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                    <span style={{fontSize:14,fontWeight:700,color:C.g900}}>{entry.category}</span>
                    {d2>0&&<span style={{fontSize:12,fontWeight:800,color:'#059669',background:'#F0FDF4',padding:'2px 8px',borderRadius:20,border:'1px solid #BBF7D0'}}>+{d2} pts</span>}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:12,color:C.g500,fontWeight:600,minWidth:20}}>{before}</span>
                    <div style={{flex:1,height:8,borderRadius:4,background:C.g100,overflow:'hidden',maxWidth:160,position:'relative'}}>
                      <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${beforePct}%`,background:C.g300,borderRadius:4}}/>
                      {d2>0&&<div style={{position:'absolute',left:`${beforePct}%`,top:0,height:'100%',width:`${gainPct}%`,background:C.primary,borderRadius:4}}/>}
                    </div>
                    <span style={{fontSize:12,color:C.primary,fontWeight:700,minWidth:20}}>{after}</span>
                    <span style={{fontSize:11,color:C.g400}}>/{max}</span>
                  </div>
                </div>
                <Chevron open={isOpen}/>
              </div>
              {isOpen&&(
                <div style={{padding:'0 16px 16px',background:C.g50,borderTop:`1px solid ${C.g100}`}}>
                  <div style={{paddingTop:14}}>
                    {(entry.actions_that_improved_score||[]).length>0&&(
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11,fontWeight:800,color:C.teal,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>What improved this</div>
                        {(entry.actions_that_improved_score||[]).map((act,ai)=>(
                          <div key={ai} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:4}}>
                            <div style={{color:C.teal,fontWeight:700,flexShrink:0}}>✓</div>
                            <div style={{fontSize:13,color:C.g700,lineHeight:1.5}}>{act}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {entry.why_not_perfect&&(
                      <div>
                        <div style={{fontSize:11,fontWeight:800,color:C.g500,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Why not perfect</div>
                        <div style={{fontSize:13,color:C.g500,fontStyle:'italic',lineHeight:1.6}}>{entry.why_not_perfect}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Card>

      {/* ── PAGE 8: Questions for Doctor / Pharmacist ── */}
      <Card>
        <PageHdr num={8} title="Questions to Bring to Your Doctor or Pharmacist" sub="Use these prompts to make your next conversation more useful" icon={IcStar}/>
        {/* Ask Your Pharmacist */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:800,color:C.teal,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:12}}>Ask Your Pharmacist</div>
          <div style={{background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:14,padding:'16px'}}>
            {[
              "Do any of these supplements or timing changes conflict with other medications I haven't mentioned?",
              'Is the spacing between my supplements and medications enough to prevent any absorption issues?',
              "Are there any items in my stack I should take on an empty stomach even if it's uncomfortable?",
              'Will any of these timing or supplement changes affect my lab results?',
            ].map((q,i)=>(
              <div key={i} style={{display:'flex',gap:10,padding:'10px 0',borderBottom:i<3?`1px solid ${C.tealBorder}`:'none'}}>
                <div style={{width:20,height:20,borderRadius:'50%',background:C.primary,color:'white',fontSize:11,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>{i+1}</div>
                <div style={{fontSize:13,color:C.mid,lineHeight:1.6}}>{q}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Ask Your Doctor */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:800,color:C.sky,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:12}}>Ask Your Doctor</div>
          <div style={{background:C.skyBg,border:`1px solid ${C.skyBorder}`,borderRadius:14,padding:'16px'}}>
            {[
              'My Absovex report suggests some timing changes — does anything here conflict with how you intended me to take these?',
              'Should I adjust any of these timing recommendations based on my current health conditions?',
              'Now that my timing is more consistent, should I watch for any changes in how I feel?',
              'How often should I revisit this schedule as my routine or prescriptions change?',
            ].map((q,i)=>(
              <div key={i} style={{display:'flex',gap:10,padding:'10px 0',borderBottom:i<3?`1px solid ${C.skyBorder}`:'none'}}>
                <div style={{width:20,height:20,borderRadius:'50%',background:C.sky,color:'white',fontSize:11,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>{i+1}</div>
                <div style={{fontSize:13,color:'#0C4A6E',lineHeight:1.6}}>{q}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Conditional: Life Stage Questions */}
        {(()=>{
          const stage=(routine?.hormonalStage||'').toLowerCase();
          let qs=[];
          if(stage.includes('peri')){qs=[
            'Are there nutrients or supplements I should review based on my current symptoms and stage?',
            'Could any part of my routine be making sleep, mood, or energy swings worse?',
            'Are there timing changes that would better support symptom management?',
            'Are any of my current supplements overlapping or working against each other?',
          ];}
          else if(stage.includes('post')){qs=[
            'Are there nutrients I should be paying closer attention to at this stage, such as bone or muscle support?',
            'Should I review calcium, vitamin D, magnesium, or protein support with my doctor?',
            'Does my current stack reflect my age, symptoms, and health goals?',
            'Are any parts of this routine worth adjusting for long-term bone or heart health?',
          ];}
          else if(stage.includes('hrt')){qs=[
            'Are there any timing considerations I should know about with HRT and the rest of my stack?',
            'Are any of my supplements worth rechecking now that I am on HRT?',
            'Does anything in my current routine overlap with the goals of HRT?',
            'Should any of my symptoms or labs be reviewed differently because I am on HRT?',
          ];}
          else if(stage.includes('pre')){qs=[
            'Are there any parts of my routine I should review based on my cycle, symptoms, or energy patterns?',
            'Are there nutrients or supplements I should review before adding anything new?',
            'Does my current stack support my goals without unnecessary overlap?',
          ];}
          if(qs.length===0)return null;
          return(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:800,color:C.violet,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>Ask Based on Your Life Stage</div>
              <div style={{fontSize:13,color:C.g500,marginBottom:12,lineHeight:1.5}}>Because you shared your hormonal stage, here are a few extra questions you may want to bring into your next appointment.</div>
              <div style={{background:C.violetBg,border:`1px solid ${C.violetBorder}`,borderRadius:14,padding:'16px'}}>
                {qs.map((q,i)=>(
                  <div key={i} style={{display:'flex',gap:10,padding:'10px 0',borderBottom:i<qs.length-1?`1px solid ${C.violetBorder}`:'none'}}>
                    <div style={{width:20,height:20,borderRadius:'50%',background:C.violet,color:'white',fontSize:11,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>{i+1}</div>
                    <div style={{fontSize:13,color:'#4C1D95',lineHeight:1.6}}>{q}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
        {/* AI-generated prompts if available */}
        {(a.doctorPrompts||[]).length>0&&(
          <div style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:800,color:C.g500,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:12}}>Additional Questions from Your Analysis</div>
            <div style={{background:C.g50,border:`1px solid ${C.g200}`,borderRadius:14,padding:'16px'}}>
              {(a.doctorPrompts||[]).map((q,i)=>(
                <div key={i} style={{display:'flex',gap:10,padding:'10px 0',borderBottom:i<(a.doctorPrompts.length-1)?`1px solid ${C.g200}`:'none'}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:C.g400,color:'white',fontSize:11,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>{i+1}</div>
                  <div style={{fontSize:13,color:C.g700,lineHeight:1.6}}>{q}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{background:'#FFF7ED',border:'1px solid #FED7AA',borderRadius:12,padding:'12px 16px'}}>
          <div style={{fontSize:12,color:'#92400E',lineHeight:1.6}}>This report is for educational purposes only and is not medical advice. Review any medication or supplement changes with your doctor, pharmacist, or other qualified healthcare professional.</div>
        </div>
      </Card>

      {/* ── AI ADVISOR ── */}
      <Card style={{border:`1px solid ${C.pink}40`}}>
        <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:20}}>
          <div style={{width:52,height:52,borderRadius:14,background:`linear-gradient(135deg,${C.pink},${C.pinkLight})`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 12px rgba(236,0,139,0.3)'}}>
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:C.g400,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:2}}>Always Available</div>
            <div style={{fontSize:19,fontWeight:800,color:C.g900,lineHeight:1.2}}>Refine Your Plan with the Absovex AI Advisor</div>
            <div style={{fontSize:13,color:C.g500,marginTop:3}}>Ask real-life questions about timing, spacing, and what feels hard to follow</div>
          </div>
        </div>
        <AIChatSection a={a} chat={chat} chatLoad={chatLoad} sendChat={sendChat} revisionPending={revisionPending} setRevisionPending={setRevisionPending} runRevision={runRevision} advisorLocked={advisorLocked} interactionCount={interactionCount} reportUpdateUsed={reportUpdateUsed} downloadReport={downloadReport} chatEnd={chatEnd}/>
      </Card>
    </div>
  );
}

const SS={border:`1px solid ${C.g300}`,borderRadius:6,padding:'10px 11px',fontSize:16,width:'100%',boxSizing:'border-box',outline:'none',background:'white',color:'#111827',WebkitAppearance:'none',cursor:'pointer'};

function renderMd(text){
  const lines=text.split('\n');
  const out=[];
  let i=0;
  while(i<lines.length){
    const l=lines[i];
    if(/^###\s/.test(l)){out.push(<div key={i} style={{fontWeight:700,fontSize:13,color:C.primary,marginTop:10,marginBottom:2}}>{l.replace(/^###\s/,'')}</div>);}
    else if(/^##\s/.test(l)){out.push(<div key={i} style={{fontWeight:800,fontSize:15,color:C.g900,marginTop:12,marginBottom:4}}>{l.replace(/^##\s/,'')}</div>);}
    else if(/^#\s/.test(l)){out.push(<div key={i} style={{fontWeight:800,fontSize:16,color:C.g900,marginTop:12,marginBottom:4}}>{l.replace(/^#\s/,'')}</div>);}
    else if(/^---+$/.test(l.trim())){out.push(<hr key={i} style={{border:'none',borderTop:`1px solid ${C.g200}`,margin:'8px 0'}}/>);}
    else if(/^[-*]\s/.test(l)){out.push(<div key={i} style={{display:'flex',gap:6,marginBottom:2}}><span style={{color:C.primary,flexShrink:0}}>•</span><span>{inlineMd(l.replace(/^[-*]\s/,''))}</span></div>);}
    else if(l.trim()===''){out.push(<div key={i} style={{height:6}}/>);}
    else{out.push(<div key={i} style={{marginBottom:2}}>{inlineMd(l)}</div>);}
    i++;
  }
  return out;
}

function inlineMd(text){
  const parts=text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p,i)=>{
    if(/^\*\*[^*]+\*\*$/.test(p))return<strong key={i}>{p.slice(2,-2)}</strong>;
    if(/^`[^`]+`$/.test(p))return<code key={i} style={{background:C.g100,borderRadius:3,padding:'1px 5px',fontSize:12,fontFamily:'monospace'}}>{p.slice(1,-1)}</code>;
    return p;
  });
}

export default function App(){
  const[screen,setScreen]=useState('welcome');
  const[items,setItems]=useState([NEW_ITEM(1)]);
  const[routine,setRoutine]=useState(DEF_R);
  const[result,setResult]=useState(null);
  const[err,setErr]=useState('');
  const[tab,setTab]=useState('schedule');
  const[chat,setChat]=useState([{role:'assistant',content:"Before you download, use the advisor to pressure test your plan.\n\nGood things to ask:\n• Can I group any of these together to make the schedule easier?\n• What should stay separated, and why?\n• What do I do if my meal or coffee timing changes?\n• Can this plan work if I want fewer pill times each day?\n• Is there a simpler version of this schedule that still protects absorption?\n\nIf something feels unrealistic, confusing, or too spread out, ask here before you lock in your report."}]);
  const[chatLoad,setChatLoad]=useState(false);
  const chatEnd=useRef(null);
  const[interactionCount,setInteractionCount]=useState(0);
  const[reportUpdateUsed,setReportUpdateUsed]=useState(false);
  const[revisionPending,setRevisionPending]=useState(null);
  const[reportVersion,setReportVersion]=useState(1);
  const[nearingLimitShown,setNearingLimitShown]=useState(false);
  const[sessionRestored,setSessionRestored]=useState(false);
  const[largeText,setLargeText]=useState(()=>{try{return localStorage.getItem('absovexLargeText')==='1';}catch{return false;}});
  const fs=n=>largeText?Math.round(n*1.2):n;
  const toggleLargeText=()=>setLargeText(p=>{const next=!p;try{localStorage.setItem('absovexLargeText',next?'1':'0');}catch{}return next;});
  const[expandedScheduleItem,setExpandedScheduleItem]=useState(null);
  const[expandedConflict,setExpandedConflict]=useState(null);
  const[expandedScore,setExpandedScore]=useState(null);

  // STRIPE STATE
  const[paymentStatus,setPaymentStatus]=useState(null); // 'processing', 'paid', 'failed', 'cancelled'
  const[promoCode,setPromoCode]=useState(''); // User enters BETA or other promo code
  const[stripeLoading,setStripeLoading]=useState(false);
  const[stripeErr,setStripeErr]=useState('');
  const[userEmail,setUserEmail]=useState(null);
  const[viewMode,setViewMode]=useState('quickAdd');
  const[selectedItemForDetail,setSelectedItemForDetail]=useState(null);

  // ─── FORM FONT SCALE ────────────────────────────────────────────────────────
  const FLABEL={fontSize:fs(16),fontWeight:600,color:C.g500,display:'block',marginBottom:4};
  const FLABEL6={fontSize:fs(16),fontWeight:600,color:C.g500,marginBottom:6};
  const FLABEL8={fontSize:fs(16),fontWeight:600,color:C.g500,marginBottom:8};
  const FHELPER={margin:'5px 0 0',fontSize:fs(14),color:C.g400,lineHeight:1.5};
  const FBODY={fontSize:fs(16),color:C.g600};
  const FSS={...SS,fontSize:fs(16)};
  const FTOGGLE={fontSize:fs(16),color:C.g600};

  const updItem=(id,f,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[f]:v}:i));
  const handleDetailSave=(itemId,draft)=>{
    ['name','dose','type','frequency','timing','timingTimes','ingredients','notes'].forEach(f=>{
      setItems(p=>p.map(i=>i.id===itemId?{...i,[f]:draft[f]}:i));
    });
    setSelectedItemForDetail(null);
  };
  const updR=(f,v)=>setRoutine(p=>({...p,[f]:v}));
  const HORMONAL=routine.sex==='female'?['Pre-menopausal','Peri-menopausal','Post-menopausal','On HRT','Prefer not to say']:['Standard','On TRT','Prefer not to say'];

  const pickDrug=async(itemId,drug)=>{
    setItems(p=>p.map(i=>i.id===itemId?{...i,name:drug.name,type:drug.type,dose:drug.dose,unrecognized:false,rxcui:null,fdaLabel:null,fetching:true}:i));
    const{rxcui,label}=await lookupDrug(drug.generic||drug.name);
    setItems(p=>p.map(i=>i.id===itemId?{...i,rxcui,fdaLabel:label,fetching:false}:i));
  };

  const analyze=async()=>{
    const filled=items.filter(i=>i.name.trim());
    if(filled.length<2){setErr('Please add at least 2 items.');return;}
    setErr('');setScreen('loading');
    const r=routine;
    const stackLines=filled.map((i,n)=>{
      const timingDetail=i.timing?i.timing+(i.timingTimes&&Object.keys(i.timingTimes).length>0?' ('+Object.entries(i.timingTimes).map(([k,v])=>`${k}: ${v}`).join(', ')+')'  :''):'unspecified';
      return `${n+1}. ${i.name} (${i.type}, ${i.dose}, ${i.frequency||'1x day'}, currently: ${timingDetail}${i.ingredients?', ingredients: '+i.ingredients:''}${i.notes?', '+i.notes:''}${i.unrecognized?', [user-submitted, not in database — include in analysis using clinical judgment]':''}${i.fdaLabel?', FDA: '+i.fdaLabel.slice(0,60):''})`;}
    ).join('\n');
    const routineStr=`${r.sex}${r.age?', age '+r.age:''}${r.hormonalStage?', '+r.hormonalStage:''}. Wake ${r.wakeTime}. ${r.coffeeTea?'Coffee at '+r.coffeeTime+'.':''} Breakfast ${r.breakfastStart}-${r.breakfastEnd}. Lunch ${r.lunchStart}-${r.lunchEnd}. Dinner ${r.dinnerTime}. Bedtime ${r.bedtime}. Water ${r.waterGlasses} glasses/day. Alcohol ${r.alcoholFrequency==='never'?'none':r.alcoholFrequency+', '+r.alcoholDrinks+' drinks'}.`;
    const prompt=`You are a clinical pharmacist. Return ONLY a JSON object. No text before or after. No markdown. No backticks. Keep ALL text fields under 10 words.

ROUTINE: ${routineStr}
STACK:
${stackLines}

Return this JSON with SHORT values, maximum 10 words per text field:
{"currentScore":68,"optimizedScore":87,"scoreSummary":"Two sentences max.","issueCount":3,"topIssues":[{"issue":"short text","penalty":10,"severity":"high"}],"topBenefits":["short text"],"schedule":{"morning_fasting":[{"name":"","dose":"","instruction":"short","reason":"short"}],"morning_with_breakfast":[{"name":"","dose":"","instruction":"short","reason":"short"}],"midday":[{"name":"","dose":"","instruction":"short","reason":"short"}],"evening_with_dinner":[{"name":"","dose":"","instruction":"short","reason":"short"}],"bedtime":[{"name":"","dose":"","instruction":"short","reason":"short"}]},"conflicts":[{"items":["item1","item2"],"issue":"short","penalty":5,"severity":"medium","recommendation":"short"}],"optimizationLogic":[{"item":"","oldTiming":"","newTiming":"","reason":"short"}],"quickReference":[{"time":"8AM","items":["item dose"]}],"recommendations":[{"category":"Food","tip":"short"}],"doctorPrompts":["short question"],"routineInsights":["short insight"]}`;

    try{
      const res=await fetch('/api/claude',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:8000,messages:[{role:'user',content:prompt}]})
      });
      if(!res.ok){const d=await res.json();throw new Error(d?.error?.message||`HTTP ${res.status}`);}
      const d=await res.json();
      if(d.error)throw new Error(d.error.message);
      const txt=(d.content?.find(b=>b.type==='text')?.text||'').trim();
      const cleaned=txt.replace(/```json/g,'').replace(/```/g,'').trim();
      let parsed=null;
      const attempts=[
        ()=>JSON.parse(cleaned),
        ()=>{const m=cleaned.match(/\{[\s\S]*\}/);if(m)return JSON.parse(m[0]);throw new Error('no match');},
        ()=>{const s=cleaned.indexOf('{');const e=cleaned.lastIndexOf('}');if(s>=0&&e>s)return JSON.parse(cleaned.slice(s,e+1));throw new Error('no match');}
      ];
      for(const a of attempts){try{parsed=a();if(parsed)break;}catch(_){}}
      if(!parsed)throw new Error('Could not parse response. Please try again.');
      const enriched=enrichReportData(parsed,items,routine);
      setResult(enriched);
      setPaymentStatus(null);
      setPromoCode('');
      setStripeErr('');
      localStorage.removeItem('absovexSession');
      setScreen('preview');
    }catch(e){setErr('Analysis failed: '+e.message);setScreen('routine');}
  };

  // Stripe: Create checkout session
  const startCheckout=async()=>{
    setStripeLoading(true);
    setStripeErr('');
    try{
      const res=await fetch('/api/create-checkout-session',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({promoCode:promoCode.trim().toUpperCase()})
      });
      const d=await res.json();
      if(!res.ok||d.error){
        setStripeErr(d.error||'Failed to create checkout session');
        setStripeLoading(false);
        return;
      }
      if(d.sessionId){
        localStorage.setItem('absovexReport', JSON.stringify({
          items,
          routine,
          result,
          tab,
          chat
        }));
        window.location.href=d.sessionUrl;
      }
    }catch(e){
      setStripeErr('Error starting checkout: '+e.message);
      setStripeLoading(false);
    }
  };

  // Check payment status when returning from Stripe
  useEffect(()=>{
    const searchParams=new URLSearchParams(window.location.search);
    const sessionId=searchParams.get('session_id');
    const cancelled=searchParams.get('cancelled');
    
    if(cancelled==='true'){
      const saved=localStorage.getItem('absovexReport');
      if(saved){
        const data=JSON.parse(saved);
        setItems(data.items);
        setRoutine(data.routine);
        setResult(data.result);
        setTab(data.tab);
        setChat(data.chat);
        setPaymentStatus('cancelled');
        setScreen('preview');
      }else{
        setScreen('welcome');
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if(!sessionId&&cancelled!=='true'){
      try{
        const saved=localStorage.getItem('absovexSession');
        if(saved){
          const parsed=JSON.parse(saved);
          if(Array.isArray(parsed)&&parsed.some(i=>i.name&&i.name.trim())){
            setItems(parsed.map(i=>({...NEW_ITEM(i.id||Date.now()),
              name:i.name||'',type:i.type||'supplement',dose:i.dose||'',
              timing:i.timing||'',timingTimes:i.timingTimes||{},frequency:i.frequency||'1x day',
              notes:i.notes||'',ingredients:i.ingredients||'',unrecognized:!!i.unrecognized,
              fetching:false,rxcui:null,fdaLabel:null})));
            setSessionRestored(true);
          }
        }
      }catch{}
    }

    if(sessionId){
      const saved=localStorage.getItem('absovexReport');
      if(saved){
        const data=JSON.parse(saved);
        setItems(data.items);
        setRoutine(data.routine);
        setResult(data.result);
        setTab(data.tab);
        setChat(data.chat);
        localStorage.removeItem('absovexReport');
      }
      const fetchSessionEmail=async()=>{
        try{
          const res=await fetch('/api/get-session-email',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({sessionId})
          });
          const data=await res.json();
          if(data.email)setUserEmail(data.email);
        }catch(error){
          console.error('Failed to fetch session email:',error);
        }
      };
      fetchSessionEmail();
      setScreen('results');
    }
}, []);

  useEffect(()=>{
    if(screen==='input'&&items.some(i=>i.name.trim())){
      const toSave=items.map(({id,name,type,dose,timing,timingTimes,frequency,notes,ingredients,unrecognized})=>
        ({id,name,type,dose,timing,timingTimes:timingTimes||{},frequency,notes:notes||'',ingredients:ingredients||'',unrecognized:!!unrecognized}));
      localStorage.setItem('absovexSession',JSON.stringify(toSave));
    }
  },[items,screen]);

  const ADVISOR_SYSTEM=`You are the Absovex AI Advisor — a board-certified clinical pharmacist specializing in medication timing, supplement timing, food effects on absorption, nutrient interactions, and patient-friendly counseling.

Your job: help users understand how to take their medications, supplements, vitamins, minerals, and herbs for best absorption, spacing, and effectiveness based on their daily routine.

Focus on: medication timing, supplement timing, food effects, empty stomach vs with food, fat-soluble absorption, spacing conflicts, drug-drug interactions, drug-supplement interactions, mineral conflicts, coffee/tea/dairy/fiber/alcohol timing issues, practical daily schedule design.

Write in clear, calm, plain language. Be concise and easy to understand.
Do: explain timing/absorption simply, flag conflicts, suggest practical timing improvements, state assumptions clearly, tell user when a pharmacist/physician should review something.
Do not: diagnose, prescribe, tell user to stop/start/change a prescription without clinician review, overstate certainty, guess when details are unclear.

Priority: 1. safety 2. major absorption issues 3. major spacing conflicts 4. food-related timing needs 5. convenience and adherence.

When useful, structure responses as: Summary → What stands out → Why it matters → Suggested timing approach → What to double-check with a clinician.

If unsure: "I want to be careful here because this depends on details not fully clear. Based on general guidance: [guidance]. Timing and safety can change based on dose, formulation, medical history, and other medications. Confirm with your pharmacist or doctor before making changes."

REPORT UPDATE RULE: You have the ability to suggest one report update for the user. If — and only if — you spot a clear, specific, meaningful improvement to the schedule that would benefit the user AND the update has not already been used, end your response with exactly this token on its own line: [SUGGEST_UPDATE: one-sentence description of the change]. Only suggest when it is genuinely warranted. Do not suggest for minor questions or when the update has already been used.

Do not invite open-ended conversation. After answering, optionally add one short line nudging toward download.

Report data: `;

  const runRevision=async(msg)=>{
    setChatLoad(true);
    const revPrompt=`You are updating a health stack report. The user requested this change: "${msg}"

Current report JSON:
${JSON.stringify(result)}

Return ONLY a complete updated JSON object using the exact same schema as the input. Apply the requested change to the schedule, conflicts, optimizationLogic, quickReference, scores, and summaries as appropriate. No text before or after. No markdown. No backticks.`;
    try{
      const res=await fetch('/api/claude',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:8000,messages:[{role:'user',content:revPrompt}]})});
      if(!res.ok){const d=await res.json();throw new Error(d?.error?.message||`HTTP ${res.status}`);}
      const d=await res.json();
      const txt=(d.content?.find(b=>b.type==='text')?.text||'').trim();
      const cleaned=txt.replace(/```json/g,'').replace(/```/g,'').trim();
      let parsed=null;
      const attempts=[()=>JSON.parse(cleaned),()=>{const m=cleaned.match(/\{[\s\S]*\}/);if(m)return JSON.parse(m[0]);throw new Error('no match');},()=>{const s=cleaned.indexOf('{');const e=cleaned.lastIndexOf('}');if(s>=0&&e>s)return JSON.parse(cleaned.slice(s,e+1));throw new Error('no match');}];
      for(const a of attempts){try{parsed=a();if(parsed)break;}catch(_){}}
      if(!parsed)throw new Error('parse failed');
      setResult(parsed);
      const newVer=reportVersion+1;
      setReportVersion(newVer);
      setReportUpdateUsed(true);
      setChat(prev=>[...prev,{role:'assistant',content:`Your report has been updated (v${newVer}). This is now the version that will be downloaded. Download your latest optimized report when you're ready.`}]);
    }catch{
      setChat(prev=>[...prev,{role:'assistant',content:"Something went wrong while updating your report. Your current version is still available, and no update was used."}]);
    }
    setChatLoad(false);
    setTimeout(()=>chatEnd.current?.scrollIntoView({behavior:'smooth',block:'nearest'}),100);
  };

  const sendChat=async(rawMsg)=>{
    if(!rawMsg||!rawMsg.trim()||chatLoad)return;
    if(interactionCount>=15)return;
    const msg=rawMsg.trim();
    const msgs=[...chat,{role:'user',content:msg}];
    setChat(msgs);
    setChatLoad(true);
    try{
      const res=await fetch('/api/claude',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:1000,system:ADVISOR_SYSTEM+JSON.stringify(result),messages:msgs.map(m=>({role:m.role,content:m.content}))})});
      if(!res.ok){const d=await res.json();throw new Error(d?.error?.message||`HTTP ${res.status}`);}
      const d=await res.json();
      let reply=d.content?.find(b=>b.type==='text')?.text;
      if(!reply)throw new Error('no reply');
      const suggestMatch=reply.match(/\[SUGGEST_UPDATE:\s*(.+?)\]/);
      if(suggestMatch&&!reportUpdateUsed){
        reply=reply.replace(/\[SUGGEST_UPDATE:\s*.+?\]/,'').trim();
        const suggestionMsg=`Based on what you shared, I see an opportunity to improve your schedule. I can update your report one time to reflect this — ${suggestMatch[1]}. Would you like me to make that change?`;
        setChat([...msgs,{role:'assistant',content:reply},{role:'assistant',content:suggestionMsg}]);
        setRevisionPending(suggestMatch[1]);
      }else{
        reply=reply.replace(/\[SUGGEST_UPDATE:\s*.+?\]/,'').trim();
        setChat([...msgs,{role:'assistant',content:reply}]);
      }
      const newCount=interactionCount+1;
      setInteractionCount(newCount);
      if(newCount===12&&!nearingLimitShown){
        setNearingLimitShown(true);
        setTimeout(()=>{
          setChat(prev=>[...prev,{role:'assistant',content:"Just so you know, you have a few interactions remaining in this review session. Feel free to ask anything else, or download your report when you're ready."}]);
        },500);
      }
    }catch{
      setChat([...msgs,{role:'assistant',content:"I could not complete that response right now. Please try again."}]);
    }
    setChatLoad(false);
    setTimeout(()=>chatEnd.current?.scrollIntoView({behavior:'smooth',block:'nearest'}),100);
  };

  const downloadReport=async(d,userName='',userEmail=null)=>{
    try{
      const blob=await pdf(
        <AbsovexReportPDF data={d} userName={userName} routine={routine}/>
      ).toBlob();
      const url=URL.createObjectURL(blob);
      const link=document.createElement('a');
      link.href=url;
      link.download='Absovex_Health_Stack_Report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      if(userEmail){
        const reader=new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend=async()=>{
          const base64=reader.result.split(',')[1];
          try{
            const emailRes=await fetch('/api/send-report',{
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify({email:userEmail,pdfBase64:base64,userName:userName||'User'})
            });
            const emailData=await emailRes.json();
            if(emailData.success)console.log('Report email sent to:',userEmail);
            else console.error('Failed to send report email:',emailData.error);
          }catch(error){console.error('Error sending report email:',error);}
        };
      }
      return{success:true,blob};
    }catch(error){
      console.error('PDF generation failed:',error);
      return{success:false,error};
    }
  };

  // ─── WELCOME ────────────────────────────────────────────────────────────────
  if(screen==='welcome')return(
    <div style={{minHeight:'100vh',background:C.cream,fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{maxWidth:540,textAlign:'center'}}>
        <div style={{marginBottom:24}}><img src="/Logo.png" alt="Absovex" style={{width:'70%',maxWidth:360,height:'auto'}}/></div>
        <div style={{marginBottom:20}}>
          <div style={{width:80,height:80,borderRadius:'50%',background:C.tealBg,border:`2px solid ${C.tealBorder}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
            {Ic.molecule()}
          </div>
        </div>
        <h1 style={{margin:'0 0 12px',fontSize:36,fontWeight:800,color:C.g900}}>Absorption optimized. Executed properly.</h1>
        <p style={{margin:'0 0 28px',fontSize:16,color:C.g600,lineHeight:1.6}}>Build a personalized health stack report that maximizes how your body absorbs each medication, supplement, and vitamin based on timing, food, and spacing.</p>
        <button onClick={()=>setScreen('input')} style={{width:'100%',background:`linear-gradient(135deg,${C.primary},${C.mid})`,color:'white',border:'none',borderRadius:14,padding:18,fontSize:18,fontWeight:800,cursor:'pointer',marginBottom:12,boxShadow:'0 4px 15px rgba(13,126,122,0.2)'}}>Build Your Optimization</button>
        <p style={{fontSize:13,color:C.g400,margin:'0 0 8px'}}>Takes about 3-5 minutes. No account needed.</p>
        <p style={{fontSize:13,color:C.g500,margin:0}}>Your data is private and never stored.</p>
      </div>
    </div>
  );

  // ─── INPUT ──────────────────────────────────────────────────────────────────
  if(screen==='input')return(
    <div style={{minHeight:'100vh',background:C.cream,fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif',position:'relative',zIndex:1,overflowX:'hidden'}}>
      <div style={{background:C.tealBg,borderTop:`3px solid ${C.primary}`,padding:'14px 20px'}}>
        <div style={{maxWidth:720,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><LogoHeader/><div style={{color:C.g500,fontSize:fs(14),marginTop:2}}>Step 1 of 4 — Enter Your Stack</div></div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <button title="Adjust text size" onClick={toggleLargeText} style={{background:largeText?C.tealBg:'white',border:`1.5px solid ${largeText?C.teal:C.g300}`,borderRadius:8,padding:'5px 10px',fontSize:13,fontWeight:800,color:largeText?C.teal:C.g500,cursor:'pointer',letterSpacing:'0.03em'}}>AA</button>
            <button onClick={()=>setItems(SAMPLE)} style={{background:C.primary,color:'white',border:'none',borderRadius:8,padding:'7px 13px',fontSize:fs(13),cursor:'pointer',fontWeight:700}}>Load Sample</button>
          </div>
        </div>
      </div>
      <div style={{maxWidth:720,margin:'0 auto',padding:'20px 16px'}}>
        <div style={{background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:10,padding:'10px 16px',marginBottom:12,display:'flex',gap:8,alignItems:'center'}}>
          <span style={{fontSize:12,color:C.primary,fontWeight:600}}>Complete your entries in one sitting. If you leave or close this page, your progress will be saved and restored when you return.</span>
        </div>
        {sessionRestored&&(
          <div style={{background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:10,padding:'10px 16px',marginBottom:12,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <span style={{fontSize:12,color:'#92400E',fontWeight:600}}>We restored your previous entries. Please review before continuing.</span>
            <button onClick={()=>{setItems([NEW_ITEM(1)]);localStorage.removeItem('absovexSession');setSessionRestored(false);}} style={{background:'none',border:'1px solid #FDE68A',borderRadius:7,padding:'5px 12px',fontSize:12,color:'#92400E',cursor:'pointer',fontWeight:600,whiteSpace:'nowrap'}}>Start fresh</button>
          </div>
        )}
        <div style={{display:'flex',gap:10,marginBottom:14}}>
          <div style={{flex:1,background:C.blueBg,border:`1px solid ${C.blueBorder}`,borderRadius:10,padding:'10px 16px',display:'flex',gap:10,alignItems:'center'}}>
            {Ic.signal()}
            <span style={{fontSize:12,fontWeight:700,color:C.blue}}>Live Drug Database - FDA - RxNorm - DailyMed</span>
          </div>
          <div style={{background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:10,padding:'10px 16px',display:'flex',gap:8,alignItems:'center',whiteSpace:'nowrap'}}>
            <span style={{fontSize:14}}>🔒</span>
            <span style={{fontSize:12,fontWeight:700,color:C.primary}}>Your data is private and never stored</span>
          </div>
        </div>
        <div style={{background:'white',borderRadius:14,padding:'22px',boxShadow:'0 2px 8px rgba(0,0,0,0.07)',marginBottom:14}}>
          <h2 style={{margin:'0 0 6px',fontSize:18,fontWeight:800,color:C.g900}}>Your Current Health Stack</h2>
          <p style={{margin:'0 0 14px',fontSize:14,color:C.g500}}>Add everything you take - medications, supplements, vitamins, minerals, herbs.</p>
          <div style={{display:'flex',gap:8,marginBottom:16}}>
            {[['quickAdd','⚡ Quick Add'],['detailed','≡ Detailed']].map(([mode,label])=>(
              <button key={mode} onClick={()=>{setSelectedItemForDetail(null);setViewMode(mode);}}
                style={{padding:'7px 16px',borderRadius:8,border:`1.5px solid ${viewMode===mode?C.primary:C.g300}`,background:viewMode===mode?C.primary:'white',color:viewMode===mode?'white':C.g600,fontSize:14,fontWeight:600,cursor:'pointer'}}>
                {label}
              </button>
            ))}
          </div>
          {viewMode==='quickAdd'&&(
            <QuickAddTable items={items} updItem={updItem} setItems={setItems} onMoreClick={id=>setSelectedItemForDetail(id)} pickDrug={pickDrug} C={C} fs={fs} TIMING_OPTIONS={TIMING_OPTIONS}/>
          )}
          {viewMode==='detailed'&&(<>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {items.map((item,idx)=>{
              const tip=item.name?getTip(item.name):null;
              return(
                <div key={item.id} style={{background:C.g50,borderRadius:10,padding:'16px',border:`1px solid ${C.g200}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                    <span style={{fontSize:11,fontWeight:700,color:C.g400,textTransform:'uppercase',letterSpacing:'0.06em'}}>Item {idx+1}</span>
                    {items.length>1&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{background:'none',border:'none',color:C.g400,cursor:'pointer',fontSize:22,padding:0,lineHeight:1}}>x</button>}
                  </div>
                  <div style={{marginBottom:10}}>
                    <label style={FLABEL}>Name</label>
                    <NameField
                      value={item.name}
                      onCommit={v=>updItem(item.id,'name',v)}
                      onSelect={m=>{updItem(item.id,'unrecognized',false);pickDrug(item.id,m);}}
                      onUnrecognized={flag=>updItem(item.id,'unrecognized',flag)}/>
                    <p style={{...FHELPER,margin:'4px 0 0'}}>Enter brand name or generic name. Example: Eliquis or Apixaban.</p>
                    {item.unrecognized&&!item.fetching&&!item.fdaLabel&&(
                      <div style={{background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:8,padding:'9px 13px',marginTop:6,fontSize:fs(14),color:C.primary,lineHeight:1.5}}>
                        We didn't find an exact match. You can still add this and we'll include it in your report.
                      </div>
                    )}
                  </div>
                  <div style={{marginBottom:10}}>
                    <label style={{...FLABEL,display:'flex',alignItems:'center',gap:5}}>
                      Ingredients or active components <span style={{fontWeight:400,color:C.g400}}>(optional)</span>
                      <span style={{position:'relative',display:'inline-flex',alignItems:'center'}} onMouseEnter={e=>e.currentTarget.querySelector('.ing-tip').style.display='block'} onMouseLeave={e=>e.currentTarget.querySelector('.ing-tip').style.display='none'} onTouchStart={e=>{const t=e.currentTarget.querySelector('.ing-tip');t.style.display=t.style.display==='block'?'none':'block';}}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" style={{cursor:'pointer',flexShrink:0}}><circle cx={12} cy={12} r={10} stroke={C.g400} strokeWidth={2}/><path d="M12 16v-4M12 8h.01" stroke={C.g400} strokeWidth={2} strokeLinecap="round"/></svg>
                        <span className="ing-tip" style={{display:'none',position:'absolute',bottom:'calc(100% + 6px)',left:'50%',transform:'translateX(-50%)',background:C.g800,color:'white',fontSize:11,lineHeight:1.5,padding:'8px 12px',borderRadius:8,whiteSpace:'normal',width:240,zIndex:99,boxShadow:'0 4px 12px rgba(0,0,0,0.15)',fontWeight:400,pointerEvents:'none'}}>
                          Optional. List key ingredients if your supplement has multiple active components. Example: Lutein 10mg, Zeaxanthin 2mg.
                        </span>
                      </span>
                    </label>
                    <StableInput value={item.ingredients||''} onCommit={v=>updItem(item.id,'ingredients',v)} placeholder="e.g., Lutein 10mg, Zeaxanthin 2mg, Meso-zeaxanthin 10mg" style={{...FSS,cursor:'text'}}/>
                    {item.ingredients&&item.ingredients.trim()&&(
                      <div style={{fontSize:fs(14),color:C.primary,marginTop:4,fontWeight:500}}>Got it. We'll include the ingredients you listed in your report analysis.</div>
                    )}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:10}}>
                    <div>
                      <label style={FLABEL}>Type</label>
                      <select value={item.type} onChange={e=>updItem(item.id,'type',e.target.value)} style={FSS}>
                        {['medication','supplement','vitamin','mineral','herb'].map(o=><option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={FLABEL}>Dose</label>
                      <StableInput value={item.dose} onCommit={v=>updItem(item.id,'dose',v)} placeholder="e.g., 500mg" style={{...FSS,cursor:'text'}}/>
                    </div>
                    <div>
                      <label style={FLABEL}>Frequency</label>
                      <select value={item.frequency||'1x day'} onChange={e=>updItem(item.id,'frequency',e.target.value)} style={FSS}>
                        {['1x day','2x day','3x day','Weekly','Monthly','As needed'].map(f=><option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{marginBottom:10}}>
                    <label style={{...FLABEL,marginBottom:6}}>When do you currently take this? <span style={{fontWeight:400,color:C.g400}}>(optional — select all that apply)</span></label>
                    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:6}}>
                      {TIMING_OPTIONS.map(opt=>{
                        const selected=(item.timing||'').split(',').map(s=>s.trim()).filter(Boolean).includes(opt);
                        return(
                          <button key={opt} type="button" onClick={()=>{
                            const cur=(item.timing||'').split(',').map(s=>s.trim()).filter(Boolean);
                            const next=selected?cur.filter(x=>x!==opt):[...cur,opt];
                            const newTimes={...item.timingTimes};
                            if(!next.includes(opt))delete newTimes[opt];
                            updItem(item.id,'timingTimes',newTimes);
                            updItem(item.id,'timing',next.join(', '));
                          }} style={{padding:'7px 14px',borderRadius:20,border:`1.5px solid ${selected?C.teal:C.g200}`,background:selected?C.tealBg:'white',color:selected?C.teal:C.g600,fontSize:fs(15),fontWeight:selected?700:400,cursor:'pointer'}}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {(item.timing||'').split(',').map(s=>s.trim()).filter(Boolean).length>0&&(
                      <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:4}}>
                        {(item.timing||'').split(',').map(s=>s.trim()).filter(Boolean).map(opt=>(
                          <div key={opt} style={{display:'flex',alignItems:'center',gap:10}}>
                            <label style={{fontSize:fs(15),color:C.g600,fontWeight:600,minWidth:140}}>{opt} dose time</label>
                            <input type="time" value={(item.timingTimes||{})[opt]||''} onChange={e=>{
                              updItem(item.id,'timingTimes',{...(item.timingTimes||{}),[opt]:e.target.value});
                            }} style={{border:`1.5px solid ${C.g200}`,borderRadius:8,padding:'6px 10px',fontSize:14,color:C.g800,background:'white',outline:'none',cursor:'pointer'}}/>
                          </div>
                        ))}
                      </div>
                    )}
                    <p style={{...FHELPER,margin:'6px 0 0'}}>Telling us when you actually take this helps show a more accurate before/after comparison.</p>
                  </div>
                  {item.fetching&&<div style={{background:C.blueBg,border:`1px solid ${C.blueBorder}`,borderRadius:8,padding:'9px 13px',marginBottom:10,fontSize:12,color:C.blue,fontWeight:600}}>Looking up in FDA database...</div>}
                  {!item.fetching&&item.fdaLabel&&(
                    <div style={{border:`1px solid ${C.blueBorder}`,borderRadius:8,overflow:'hidden',marginBottom:10}}>
                      <div style={{background:C.blue,padding:'7px 13px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{fontSize:12,fontWeight:700,color:'white'}}>FDA / RxNorm Data</span>
                        {item.rxcui&&<span style={{fontSize:10,color:'#BFDBFE'}}>RxCUI: {item.rxcui}</span>}
                      </div>
                      <div style={{padding:'10px 13px',background:C.blueBg}}><p style={{margin:0,fontSize:12,color:'#1E3A8A',lineHeight:1.6}}>{item.fdaLabel}</p></div>
                    </div>
                  )}
                  {!item.fetching&&!item.fdaLabel&&tip&&(
                    <div style={{background:C.blueBg,border:`1px solid ${C.blueBorder}`,borderRadius:8,padding:'10px 13px',marginBottom:10}}>
                      <div style={{fontSize:11,fontWeight:700,color:C.blue,marginBottom:4}}>Timing Guidance</div>
                      <p style={{margin:0,fontSize:13,color:'#1E40AF',lineHeight:1.6}}>{tip}</p>
                    </div>
                  )}
                  {!item.fetching&&!item.fdaLabel&&!tip&&item.name.length>2&&(
                    <button onClick={()=>pickDrug(item.id,{name:item.name,type:item.type,dose:item.dose})} style={{background:C.blueBg,border:`1px solid ${C.blueBorder}`,borderRadius:8,padding:'8px 13px',fontSize:12,color:C.blue,cursor:'pointer',marginBottom:10,width:'100%',textAlign:'left',fontWeight:600}}>
                      Look up "{item.name}" in FDA database
                    </button>
                  )}
                  <div>
                    <label style={FLABEL}>Personal Notes (optional)</label>
                    <StableInput value={item.notes} onCommit={v=>updItem(item.id,'notes',v)} placeholder="e.g., makes me nauseous, take with food..." style={{...FSS,cursor:'text'}}/>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={()=>setItems(p=>[...p,NEW_ITEM(Date.now())])} style={{marginTop:10,background:'none',border:`2px dashed ${C.g300}`,borderRadius:8,padding:11,width:'100%',color:C.g500,fontSize:14,cursor:'pointer'}}>+ Add Another Item</button>
          </>)}
        </div>
        {err&&<div style={{background:C.redBg,border:`1px solid ${C.red}`,borderRadius:8,padding:'10px 14px',color:C.red,fontSize:14,marginBottom:12}}>{err}</div>}
        <button onClick={()=>{const f=items.filter(i=>i.name.trim());if(f.length<2){setErr('Please add at least 2 items.');return;}setErr('');setScreen('routine');}} style={{width:'100%',background:`linear-gradient(135deg,${C.primary},${C.mid})`,color:'white',border:'none',borderRadius:12,padding:15,fontSize:16,fontWeight:800,cursor:'pointer'}}>
          Next: Set My Daily Routine
        </button>
        <p style={{textAlign:'center',color:C.g500,fontSize:13,marginTop:8}}>Your data is private and never stored.</p>
      </div>
      {selectedItemForDetail!==null&&(()=>{
        const panelItem=items.find(i=>i.id===selectedItemForDetail);
        if(!panelItem)return null;
        return(
          <DetailPanel
            item={panelItem}
            onClose={()=>setSelectedItemForDetail(null)}
            onSave={draft=>handleDetailSave(selectedItemForDetail,draft)}
            onDelete={()=>{setItems(p=>p.filter(i=>i.id!==selectedItemForDetail));setSelectedItemForDetail(null);}}
            pickDrug={pickDrug}
            C={C} fs={fs} TIMING_OPTIONS={TIMING_OPTIONS}
          />
        );
      })()}
    </div>
  );

  // ─── ROUTINE ────────────────────────────────────────────────────────────────
  if(screen==='routine')return(
    <div style={{minHeight:'100vh',background:C.cream,fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif',position:'relative',zIndex:1}}>
      <div style={{background:C.tealBg,borderTop:`3px solid ${C.primary}`,padding:'14px 20px'}}>
        <div style={{maxWidth:600,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><LogoHeader/><div style={{color:C.g500,fontSize:fs(14),marginTop:2}}>Step 2 of 4 — My Routine</div></div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <button title="Adjust text size" onClick={toggleLargeText} style={{background:largeText?C.tealBg:'white',border:`1.5px solid ${largeText?C.teal:C.g300}`,borderRadius:8,padding:'5px 10px',fontSize:13,fontWeight:800,color:largeText?C.teal:C.g500,cursor:'pointer',letterSpacing:'0.03em'}}>AA</button>
            <button onClick={()=>setScreen('input')} style={{background:'none',border:`1px solid ${C.tealBorder}`,color:C.primary,borderRadius:8,padding:'6px 12px',fontSize:fs(14),cursor:'pointer'}}>Back</button>
          </div>
        </div>
      </div>
      <div style={{maxWidth:600,margin:'0 auto',padding:'20px 16px'}}>
        <div style={{marginBottom:18}}><h2 style={{margin:'0 0 4px',fontSize:fs(20),fontWeight:800,color:C.g900}}>My Routine</h2><p style={{margin:0,fontSize:fs(15),color:C.g500}}>Set your daily schedule to perfectly time your medications.</p></div>
        <RRow icon={Ic.person()} title="About You" sub="Helps us personalize your plan for your current stage">
          <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:16,alignItems:'start'}}>
            <div>
              <div style={FLABEL8}>Biological Sex</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:12}}>
                {['female','male','other','prefer not to say'].map(s=>(
                  <button key={s} onClick={()=>updR('sex',s)} style={{padding:'10px 12px',borderRadius:10,border:`1.5px solid ${routine.sex===s?C.teal:C.g200}`,background:routine.sex===s?C.tealBg:'white',color:routine.sex===s?C.teal:C.g600,fontSize:14,fontWeight:routine.sex===s?700:400,cursor:'pointer',textTransform:'capitalize'}}>
                    {s==='prefer not to say'?'Prefer not to say':s.charAt(0).toUpperCase()+s.slice(1)}
                  </button>
                ))}
              </div>
              {(routine.sex==='female'||routine.sex==='male')&&(
                <div>
                  <div style={FLABEL6}>Hormonal Stage</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {HORMONAL.map(s=><button key={s} onClick={()=>updR('hormonalStage',s)} style={{padding:'7px 12px',borderRadius:20,border:`1.5px solid ${routine.hormonalStage===s?C.teal:C.g200}`,background:routine.hormonalStage===s?C.tealBg:'white',color:routine.hormonalStage===s?C.teal:C.g600,fontSize:13,fontWeight:routine.hormonalStage===s?700:400,cursor:'pointer'}}>{s}</button>)}
                  </div>
                </div>
              )}
            </div>
            <div><div style={FLABEL8}>Age</div><input type="number" value={routine.age} onChange={e=>updR('age',e.target.value)} placeholder="--" min="1" max="120" style={{border:`1.5px solid ${C.g200}`,borderRadius:10,padding:'10px 12px',fontSize:16,width:72,textAlign:'center',outline:'none',color:C.g800}}/></div>
          </div>
        </RRow>
        <RRow icon={Ic.sun()} title="Wake Time" sub="When do you typically wake up?"><TimeInput value={routine.wakeTime} onChange={v=>updR('wakeTime',v)}/></RRow>
        <RRow icon={Ic.coffee()} title="Morning Tea or Coffee" sub="Helps us space things that need to stay away from caffeine">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:routine.coffeeTea?12:0}}>
            <span style={FTOGGLE}>I drink coffee or tea in the morning</span>
            <Toggle on={routine.coffeeTea} onChange={v=>updR('coffeeTea',v)}/>
          </div>
          {routine.coffeeTea&&<div><div style={FLABEL6}>Usually around</div><TimeInput value={routine.coffeeTime} onChange={v=>updR('coffeeTime',v)}/></div>}
        </RRow>
        <RRow icon={Ic.fork()} title="Breakfast Window" sub="Set a range if your breakfast time varies">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:routine.hasBreakfast!==false?12:0}}>
            <span style={FTOGGLE}>I eat this meal</span>
            <Toggle on={routine.hasBreakfast!==false} onChange={v=>updR('hasBreakfast',v)}/>
          </div>
          {routine.hasBreakfast!==false&&<div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <TimeInput value={routine.breakfastStart} onChange={v=>updR('breakfastStart',v)}/>
            <span style={{color:C.g400,fontSize:14}}>to</span>
            <TimeInput value={routine.breakfastEnd} onChange={v=>updR('breakfastEnd',v)}/>
          </div>}
        </RRow>
        <RRow icon={Ic.salad()} title="Lunch Window" sub="Your midday meal time range">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:routine.hasLunch!==false?12:0}}>
            <span style={FTOGGLE}>I eat this meal</span>
            <Toggle on={routine.hasLunch!==false} onChange={v=>updR('hasLunch',v)}/>
          </div>
          {routine.hasLunch!==false&&<div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <TimeInput value={routine.lunchStart} onChange={v=>updR('lunchStart',v)}/>
            <span style={{color:C.g400,fontSize:14}}>to</span>
            <TimeInput value={routine.lunchEnd} onChange={v=>updR('lunchEnd',v)}/>
          </div>}
        </RRow>
        <RRow icon={Ic.plate()} title="Dinner" sub="Your evening meal time">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:routine.hasDinner!==false?12:0}}>
            <span style={FTOGGLE}>I eat this meal</span>
            <Toggle on={routine.hasDinner!==false} onChange={v=>updR('hasDinner',v)}/>
          </div>
          {routine.hasDinner!==false&&<TimeInput value={routine.dinnerTime} onChange={v=>updR('dinnerTime',v)}/>}
        </RRow>
        <RRow icon={Ic.moon()} title="Evening Snack" sub="Useful for planning around evening medications" optional>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:routine.eveningSnack?12:0}}>
            <span style={FTOGGLE}>I usually have an evening snack</span>
            <Toggle on={routine.eveningSnack} onChange={v=>updR('eveningSnack',v)}/>
          </div>
          {routine.eveningSnack&&<TimeInput value={routine.snackTime} onChange={v=>updR('snackTime',v)}/>}
        </RRow>
        <RRow icon={Ic.bed()} title="Bedtime" sub="When do you go to sleep?"><TimeInput value={routine.bedtime} onChange={v=>updR('bedtime',v)}/></RRow>
        <RRow icon={Ic.drop()} title="Daily Water Intake" sub="Hydration affects how your body absorbs medications and supplements">
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={FTOGGLE}>Glasses per day</span>
              <span style={{fontSize:22,fontWeight:800,color:C.teal}}>{routine.waterGlasses}</span>
            </div>
            <input type="range" min={1} max={16} step={1} value={routine.waterGlasses} onChange={e=>updR('waterGlasses',Number(e.target.value))} style={{width:'100%',accentColor:C.teal,cursor:'pointer'}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:C.g400,marginTop:4}}><span>1</span><span>8</span><span>16 glasses</span></div>
          </div>
        </RRow>
        <RRow icon={Ic.wine()} title="Alcohol Consumption" sub="Alcohol interacts with many medications and affects absorption" optional>
          <div>
            <div style={FLABEL8}>How often do you drink?</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
              {['never','occasionally','1-2x week','3-4x week','daily'].map(f=>(
                <button key={f} type="button" onClick={()=>updR('alcoholFrequency',f)} style={{padding:'8px 14px',borderRadius:20,border:`1.5px solid ${routine.alcoholFrequency===f?C.teal:C.g200}`,background:routine.alcoholFrequency===f?C.tealBg:'white',color:routine.alcoholFrequency===f?C.teal:C.g600,fontSize:13,fontWeight:routine.alcoholFrequency===f?700:400,cursor:'pointer'}}>
                  {f==='never'?'Never':f==='occasionally'?'Occasionally':f==='1-2x week'?'1-2x/week':f==='3-4x week'?'3-4x/week':'Daily'}
                </button>
              ))}
            </div>
            {routine.alcoholFrequency!=='never'&&(
              <div>
                <div style={FLABEL6}>How many drinks per occasion?</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {['1','1-2','2-3','3+'].map(dr=>(
                    <button key={dr} onClick={()=>updR('alcoholDrinks',dr)} style={{padding:'8px 14px',borderRadius:20,border:`1.5px solid ${routine.alcoholDrinks===dr?C.teal:C.g200}`,background:routine.alcoholDrinks===dr?C.tealBg:'white',color:routine.alcoholDrinks===dr?C.teal:C.g600,fontSize:13,fontWeight:routine.alcoholDrinks===dr?700:400,cursor:'pointer'}}>{dr} {dr==='1'?'drink':'drinks'}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </RRow>
        <button onClick={()=>setScreen('review')} style={{width:'100%',background:`linear-gradient(135deg,${C.primary},${C.mid})`,color:'white',border:'none',borderRadius:12,padding:15,fontSize:fs(16),fontWeight:800,cursor:'pointer',marginTop:20}}>
          Review My Entries
        </button>
        {err&&<div style={{background:C.redBg,border:`1px solid ${C.red}`,borderRadius:8,padding:'10px 14px',color:C.red,fontSize:14,marginTop:12}}>{err}</div>}
      </div>
    </div>
  );

  // ─── REVIEW ─────────────────────────────────────────────────────────────────
  if(screen==='review'){
    const fmtTime=t=>{if(!t)return null;const[h,m]=t.split(':');const hr=parseInt(h);return`${hr%12||12}:${m} ${hr<12?'AM':'PM'}`;};
    const filledItems=items.filter(i=>i.name.trim());
    const meds=filledItems.filter(i=>i.type==='medication');
    const supps=filledItems.filter(i=>i.type!=='medication');
    const rv=routine;
    const RSection=({title,onEdit,children})=>(
      <div style={{background:'white',borderRadius:14,padding:'18px 20px',marginBottom:10,boxShadow:'0 1px 4px rgba(0,0,0,0.05)',border:`1px solid ${C.g100}`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <span style={{fontSize:fs(16),fontWeight:800,color:C.g900}}>{title}</span>
          <button onClick={onEdit} style={{background:'none',border:`1px solid ${C.tealBorder}`,color:C.primary,borderRadius:8,padding:'5px 14px',fontSize:fs(14),fontWeight:600,cursor:'pointer'}}>Edit</button>
        </div>
        {children}
      </div>
    );
    const ItemRow=({item})=>(
      <div style={{borderBottom:`1px solid ${C.g100}`,paddingBottom:10,marginBottom:10}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
          <span style={{fontSize:fs(16),fontWeight:700,color:C.g900}}>{item.name}</span>
          <span style={{fontSize:fs(13),color:C.g500,background:C.g100,borderRadius:12,padding:'2px 10px',whiteSpace:'nowrap',flexShrink:0,textTransform:'capitalize'}}>{item.type}</span>
        </div>
        {item.dose&&<div style={{fontSize:fs(14),color:C.g600,marginTop:3}}>Dose: {item.dose}</div>}
        {item.frequency&&<div style={{fontSize:fs(14),color:C.g600}}>Frequency: {item.frequency}</div>}
        {item.timing&&<div style={{fontSize:fs(14),color:C.g600}}>Timing: {item.timing}{item.timingTimes&&Object.keys(item.timingTimes).length>0?' ('+Object.entries(item.timingTimes).map(([k,v])=>`${k}: ${fmtTime(v)||v}`).join(', ')+')'  :''}</div>}
        {item.ingredients&&<div style={{fontSize:fs(14),color:C.g600}}>Ingredients: {item.ingredients}</div>}
        {item.notes&&<div style={{fontSize:fs(14),color:C.g600}}>Notes: {item.notes}</div>}
        {item.unrecognized&&<div style={{fontSize:fs(13),color:C.amber,fontWeight:600,marginTop:4}}>⚠ Added as entered. Verify spelling before generating your report.</div>}
      </div>
    );
    return(
      <div style={{minHeight:'100vh',background:C.cream,fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif',position:'relative',zIndex:1}}>
        <div style={{background:C.tealBg,borderTop:`3px solid ${C.primary}`,padding:'14px 20px'}}>
          <div style={{maxWidth:680,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div><LogoHeader/><div style={{color:C.g500,fontSize:fs(14),marginTop:2}}>Step 3 of 4 — Review</div></div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <button title="Adjust text size" onClick={toggleLargeText} style={{background:largeText?C.tealBg:'white',border:`1.5px solid ${largeText?C.teal:C.g300}`,borderRadius:8,padding:'5px 10px',fontSize:13,fontWeight:800,color:largeText?C.teal:C.g500,cursor:'pointer',letterSpacing:'0.03em'}}>AA</button>
              <button onClick={()=>setScreen('routine')} style={{background:'none',border:`1px solid ${C.tealBorder}`,color:C.primary,borderRadius:8,padding:'6px 12px',fontSize:fs(14),cursor:'pointer'}}>Back</button>
            </div>
          </div>
        </div>
        <div style={{maxWidth:680,margin:'0 auto',padding:'20px 16px'}}>
          <div style={{background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:10,padding:'12px 16px',marginBottom:18}}>
            <p style={{margin:0,fontSize:fs(15),color:C.primary,fontWeight:600,lineHeight:1.5}}>Review your entries before we generate your report. Make any corrections now.</p>
          </div>
          {meds.length>0&&(
            <RSection title="Medications" onEdit={()=>setScreen('input')}>
              {meds.map(i=><ItemRow key={i.id} item={i}/>)}
            </RSection>
          )}
          {supps.length>0&&(
            <RSection title="Supplements, Vitamins & Herbs" onEdit={()=>setScreen('input')}>
              {supps.map(i=><ItemRow key={i.id} item={i}/>)}
            </RSection>
          )}
          <RSection title="Daily Routine" onEdit={()=>setScreen('routine')}>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {[
                ['Wake time', fmtTime(rv.wakeTime)],
                rv.coffeeTea&&['Coffee / Tea', fmtTime(rv.coffeeTime)],
                rv.hasBreakfast!==false&&['Breakfast', `${fmtTime(rv.breakfastStart)} – ${fmtTime(rv.breakfastEnd)}`],
                rv.hasLunch!==false&&['Lunch', `${fmtTime(rv.lunchStart)} – ${fmtTime(rv.lunchEnd)}`],
                rv.hasDinner!==false&&['Dinner', fmtTime(rv.dinnerTime)],
                rv.eveningSnack&&['Evening snack', fmtTime(rv.snackTime)],
                ['Bedtime', fmtTime(rv.bedtime)],
                ['Water intake', `${rv.waterGlasses} glasses/day`],
                ['Alcohol', rv.alcoholFrequency==='never'?'None':`${rv.alcoholFrequency}${rv.alcoholFrequency!=='never'?', '+rv.alcoholDrinks+' drink(s)':''}`],
                rv.sex&&['Sex', rv.sex],
                rv.age&&['Age', rv.age],
                rv.hormonalStage&&['Hormonal stage', rv.hormonalStage],
              ].filter(Boolean).map(([label,val])=>(
                <div key={label} style={{display:'flex',gap:8,fontSize:fs(15)}}>
                  <span style={{color:C.g500,minWidth:160,flexShrink:0}}>{label}</span>
                  <span style={{color:C.g800,fontWeight:600}}>{val}</span>
                </div>
              ))}
            </div>
          </RSection>
          {err&&<div style={{background:C.redBg,border:`1px solid ${C.red}`,borderRadius:8,padding:'10px 14px',color:C.red,fontSize:fs(14),marginBottom:12}}>{err}</div>}
          <button onClick={analyze} style={{width:'100%',background:`linear-gradient(135deg,${C.primary},${C.mid})`,color:'white',border:'none',borderRadius:12,padding:16,fontSize:fs(17),fontWeight:800,cursor:'pointer',marginTop:4}}>
            This looks right. Generate my report.
          </button>
          <p style={{textAlign:'center',color:C.g500,fontSize:fs(13),marginTop:8}}>Your data is private and never stored.</p>
        </div>
      </div>
    );
  }

  // ─── LOADING ────────────────────────────────────────────────────────────────
  if(screen==='loading')return(
    <div style={{minHeight:'100vh',background:C.cream,fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:60,height:60,borderRadius:'50%',border:`3px solid ${C.tealBorder}`,borderTop:`3px solid ${C.primary}`,animation:'spin 1s linear infinite',margin:'0 auto 20px'}}/>
        <h2 style={{margin:'0 0 8px',fontSize:20,fontWeight:800,color:C.g900}}>Analyzing Your Stack</h2>
        <p style={{margin:0,fontSize:14,color:C.g500}}>Finding conflicts and optimizations...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  // ─── PREVIEW / PAYWALL ──────────────────────────────────────────────────────
  if(screen==='preview'&&result){
    const a=result;
    const itemsReviewed=items.filter(i=>i.name.trim()).length;
    const totalConflicts=(a.conflicts&&a.conflicts.length>0)?a.conflicts.length:(a.topIssues?a.topIssues.length:0);
    const adjustmentsMade=(a.optimizationLogic||[]).length||totalConflicts;
    const scoreImprovement=(a.optimizedScore||0)-(a.currentScore||0);
    const topIssue=(a.conflicts&&a.conflicts.length>0)?[...a.conflicts].sort((x,y)=>(y.penalty||0)-(x.penalty||0))[0]:(a.topIssues&&a.topIssues.length>0)?{issue:a.topIssues[0].issue||a.topIssues[0],items:[],recommendation:''}:null;
    const scheduleItems=a.quickReference||[];
    const visibleSchedule=scheduleItems.slice(0,3);
    const hasMoreSchedule=scheduleItems.length>3;
    return(
      <div style={{minHeight:'100vh',background:C.cream,fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif'}}>
        <div style={{background:C.tealBg,borderTop:`3px solid ${C.primary}`,padding:'14px 20px'}}>
          <div style={{maxWidth:700,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <LogoHeader/>
              <div style={{display:'flex',gap:8}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:20,fontWeight:800,color:a.currentScore<60?C.red:a.currentScore<75?C.amber:C.primary,lineHeight:1}}>{a.currentScore}</div>
                  <div style={{fontSize:10,color:C.g400}}>current</div>
                </div>
                <div style={{display:'flex',alignItems:'center',padding:'0 4px'}}>
                  <svg width={24} height={14} viewBox="0 0 24 14"><path d="M0 7 L18 7 M12 2 L18 7 L12 12" stroke={C.pink} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:20,fontWeight:800,color:C.primary,lineHeight:1}}>{a.optimizedScore}</div>
                  <div style={{fontSize:10,color:C.g400}}>optimized</div>
                </div>
              </div>
            </div>
            <button onClick={()=>setScreen('routine')} style={{background:'none',border:`1px solid ${C.tealBorder}`,color:C.primary,borderRadius:8,padding:'8px 12px',fontSize:13,cursor:'pointer'}}>Edit</button>
          </div>
        </div>
        <div style={{maxWidth:700,margin:'0 auto',padding:'24px 20px'}}>
          {/* Score visual */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16,padding:'28px 0',marginBottom:14,background:'white',borderRadius:20,boxShadow:'0 2px 16px rgba(0,0,0,0.06)',border:`1px solid ${C.g200}`}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:62,fontWeight:900,color:C.g400,lineHeight:1}}>{a.currentScore}</div>
              <div style={{fontSize:11,color:C.g400,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginTop:4}}>Current</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
              <svg width={36} height={18} viewBox="0 0 36 18"><path d="M0 9 L28 9 M22 3 L28 9 L22 15" stroke={C.pink} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div style={{background:C.tealBg,color:C.teal,fontSize:14,fontWeight:800,padding:'4px 14px',borderRadius:20,border:`1px solid ${C.tealBorder}`}}>+{scoreImprovement} pts</div>
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:62,fontWeight:900,color:C.primary,lineHeight:1}}>{a.optimizedScore}</div>
              <div style={{fontSize:11,color:C.primary,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginTop:4}}>Optimized</div>
            </div>
          </div>
          {/* Credibility stats */}
          <div style={{display:'flex',gap:10,marginBottom:16}}>
            {[[itemsReviewed,'Items Reviewed'],[adjustmentsMade,'Adjustments Made'],[`+${scoreImprovement}`,'Score Improvement']].map(([num,label])=>(
              <div key={label} style={{flex:1,background:'white',borderRadius:12,padding:'14px 10px',textAlign:'center',boxShadow:'0 1px 8px rgba(0,0,0,0.05)',border:`1px solid ${C.g200}`}}>
                <div style={{fontSize:24,fontWeight:800,color:C.primary,lineHeight:1}}>{num}</div>
                <div style={{fontSize:11,color:C.g500,marginTop:4,lineHeight:1.3}}>{label}</div>
              </div>
            ))}
          </div>
          {/* Headline */}
          <h2 style={{fontSize:fs(20),fontWeight:800,color:C.g900,margin:'0 0 16px',lineHeight:1.3}}>
            Your routine has timing gaps. Your report shows how to fix them.
          </h2>
          {/* Issue preview */}
          {topIssue&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:fs(15),fontWeight:600,color:C.g700,marginBottom:10}}>
                {totalConflicts>0?`We found ${totalConflicts} conflict${totalConflicts!==1?'s':''} in your routine. Here's the first one:`:"We found optimization opportunities in your routine. Here's the first one:"}
              </div>
              <div style={{background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:14,padding:'16px 20px'}}>
                {topIssue.items&&topIssue.items.length>0&&<div style={{fontSize:14,fontWeight:700,color:C.primary,marginBottom:6}}>{topIssue.items.join(' + ')}</div>}
                <p style={{margin:0,fontSize:fs(15),color:C.dark,lineHeight:1.6}}>{topIssue.user_context||topIssue.issue}</p>
                {topIssue.recommendation?<div style={{marginTop:10,fontSize:fs(14),color:C.mid,fontWeight:600}}>Fix: {topIssue.recommendation}</div>:<div style={{marginTop:10,fontSize:fs(14),color:C.mid,fontWeight:600}}>See your report for the full fix.</div>}
              </div>
              <p style={{fontSize:fs(14),color:C.g500,marginTop:10,lineHeight:1.6}}>
                {totalConflicts>1?`This is 1 of ${totalConflicts} conflicts. Your full report shows all of them, plus your complete optimized schedule and when to take everything.`:'Your full report shows all optimization details, plus your complete optimized schedule and when to take everything.'}
              </p>
            </div>
          )}
          {/* Schedule teaser */}
          {visibleSchedule.length>0&&(
            <div style={{background:'white',borderRadius:16,padding:'18px 20px',marginBottom:20,boxShadow:'0 1px 8px rgba(0,0,0,0.05)',border:`1px solid ${C.g200}`}}>
              <div style={{fontSize:fs(14),fontWeight:700,color:C.g700,marginBottom:12}}>Here's what your optimized day looks like</div>
              {visibleSchedule.map((block,i)=>(
                <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:8}}>
                  <div style={{fontSize:fs(13),fontWeight:700,color:C.primary,minWidth:72,flexShrink:0}}>{block.time}</div>
                  <div style={{fontSize:fs(13),color:C.g700}}>{(block.items||[]).join(', ')}</div>
                </div>
              ))}
              {hasMoreSchedule&&(
                <div style={{marginTop:4,filter:'blur(3px)',opacity:0.35,userSelect:'none',pointerEvents:'none'}}>
                  {scheduleItems.slice(3,6).map((block,i)=>(
                    <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:8}}>
                      <div style={{fontSize:fs(13),fontWeight:700,color:C.primary,minWidth:72,flexShrink:0}}>{block.time}</div>
                      <div style={{fontSize:fs(13),color:C.g700}}>{(block.items||[]).join(', ')}</div>
                    </div>
                  ))}
                </div>
              )}
              {hasMoreSchedule&&(
                <div style={{marginTop:8,fontSize:fs(12),color:C.g500,fontStyle:'italic'}}>Unlock your complete personalized schedule</div>
              )}
            </div>
          )}

          {/* Paywall section */}
          <div style={{background:`linear-gradient(150deg,${C.primary} 0%,${C.mid} 60%,${C.light} 100%)`,borderRadius:24,padding:'32px 28px',boxShadow:'0 8px 32px rgba(13,126,122,0.3)'}}>
            <div style={{marginBottom:20}}>
              <div style={{color:'rgba(255,255,255,0.8)',fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:6}}>ABSOVEX Full Report</div>
              <div style={{color:'rgba(255,255,255,0.85)',fontSize:15,marginBottom:10}}>Personalized timing plan for your health stack</div>
              <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:6}}>
                <span style={{color:'white',fontSize:52,fontWeight:800,lineHeight:1}}>$29</span>
              </div>
              <div style={{color:'rgba(255,255,255,0.7)',fontSize:16,marginBottom:0}}>One-time · Instant access · Downloadable PDF</div>
            </div>
            <div style={{background:'rgba(255,255,255,0.1)',borderRadius:14,padding:'18px 20px',marginBottom:20}}>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {['Your exact daily timing plan','Every timing conflict we found, plus the fix','Food and absorption guidance','Questions to ask your doctor or pharmacist','Full score explanation','AI follow-up chat before download'].map(text=>(
                  <div key={text} style={{display:'flex',alignItems:'flex-start',gap:8,color:'white',fontSize:fs(15)}}>
                    <span style={{width:18,height:18,borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                      {Ic.check()}
                    </span>
                    <span style={{lineHeight:1.4}}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo code input */}
            {paymentStatus!=='paid'&&(
              <div style={{background:'rgba(255,255,255,0.05)',borderRadius:12,padding:'12px 16px',marginBottom:16,border:'1px solid rgba(255,255,255,0.1)'}}>
                <style>{`.promo-input::placeholder{color:rgba(255,255,255,0.6);}`}</style>
                <input
                  className="promo-input"
                  type="text"
                  value={promoCode}
                  onChange={e=>setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Have a promo code? Enter here"
                  style={{width:'100%',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:8,padding:'10px 12px',fontSize:13,color:'white',outline:'none'}}
                />
              </div>
            )}

            {/* Status messages */}
            {paymentStatus==='paid'&&(
              <div style={{background:'rgba(76,175,80,0.2)',border:'1px solid rgba(76,175,80,0.5)',borderRadius:12,padding:'12px 16px',marginBottom:16,color:'white',fontSize:13,fontWeight:700,textAlign:'center'}}>
                Payment confirmed! Unlocking your full report...
              </div>
            )}

            {paymentStatus==='cancelled'&&(
              <div style={{background:'rgba(255,152,0,0.2)',border:'1px solid rgba(255,152,0,0.5)',borderRadius:12,padding:'12px 16px',marginBottom:16,color:'#FFE082',fontSize:13,fontWeight:700,textAlign:'center'}}>
                You left before completing checkout. Start over whenever you're ready. Your session is not saved since we don't store personal data.
              </div>
            )}

            {stripeErr&&(
              <div style={{background:C.redBg,border:`1px solid ${C.red}`,borderRadius:12,padding:'12px 16px',marginBottom:16,color:C.red,fontSize:13}}>
                {stripeErr}
              </div>
            )}

            {/* Checkout button */}
            <button
              onClick={startCheckout}
              disabled={stripeLoading||paymentStatus==='paid'}
              style={{width:'100%',background:paymentStatus==='paid'?'rgba(255,255,255,0.3)':C.pink,color:'white',border:'none',borderRadius:14,padding:'16px 24px',fontSize:17,fontWeight:800,cursor:paymentStatus==='paid'?'default':'pointer',boxShadow:paymentStatus==='paid'?'none':'0 4px 20px rgba(0,0,0,0.2)',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'center',gap:10,opacity:stripeLoading?0.7:1}}>
              {stripeLoading?'Processing...':paymentStatus==='paid'?'Proceeding to Report...':'Unlock My Full Report - $29'}
            </button>

            <p style={{color:'rgba(255,255,255,0.85)',fontSize:12,textAlign:'center',margin:'0 0 2px'}}>
              Use your real email at checkout so your report reaches your inbox.
            </p>
            <p style={{color:'rgba(255,255,255,0.55)',fontSize:11,textAlign:'center',margin:'0 0 4px'}}>
              No account needed. Pay once. View instantly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS ────────────────────────────────────────────────────────────────
  if(screen==='results'&&result){
    const a=result;
    const advisorLocked=interactionCount>=15;
    return(
      <div style={{minHeight:'100vh',background:C.cream,fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif'}}>
        <div style={{background:C.tealBg,borderTop:`3px solid ${C.primary}`,padding:'14px 20px',position:'sticky',top:0,zIndex:10}}>
          <div style={{maxWidth:700,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <LogoHeader/>
              <div style={{display:'flex',gap:8}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:20,fontWeight:800,color:a.currentScore<60?C.red:a.currentScore<75?C.amber:C.primary,lineHeight:1}}>{a.currentScore}</div>
                  <div style={{fontSize:10,color:C.g400}}>current</div>
                </div>
                <div style={{display:'flex',alignItems:'center',padding:'0 4px'}}>
                  <svg width={24} height={14} viewBox="0 0 24 14"><path d="M0 7 L18 7 M12 2 L18 7 L12 12" stroke={C.pink} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:20,fontWeight:800,color:C.primary,lineHeight:1}}>{a.optimizedScore}</div>
                  <div style={{fontSize:10,color:C.g400}}>optimized</div>
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <DownloadButton a={a} downloadReport={downloadReport} userEmail={userEmail}/>
              <button onClick={()=>{setScreen('routine');setPaymentStatus(null);}} style={{background:'none',border:`1px solid ${C.tealBorder}`,color:C.primary,borderRadius:8,padding:'8px 12px',fontSize:13,cursor:'pointer'}}>Edit</button>
            </div>
          </div>
        </div>
        <div style={{maxWidth:700,margin:'0 auto',padding:'20px'}}>
          <FullReport a={a} routine={routine} expandedScheduleItem={expandedScheduleItem} setExpandedScheduleItem={setExpandedScheduleItem} expandedConflict={expandedConflict} setExpandedConflict={setExpandedConflict} expandedScore={expandedScore} setExpandedScore={setExpandedScore} chat={chat} chatLoad={chatLoad} sendChat={sendChat} revisionPending={revisionPending} setRevisionPending={setRevisionPending} runRevision={runRevision} advisorLocked={advisorLocked} interactionCount={interactionCount} reportUpdateUsed={reportUpdateUsed} downloadReport={downloadReport} chatEnd={chatEnd}/>
        </div>
      </div>
    );
  }

  return null;
}
