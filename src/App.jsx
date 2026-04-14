import { useState, useEffect, useRef } from "react";

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
      const matched=MED_DB.some(m=>m.name.toLowerCase().includes(t)||(m.aliases||'').toLowerCase().includes(t));
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

// ─── COMPONENT 1: SCORE SUMMARY CARD ────────────────────────────────────────
function ScoreSummaryCard({a}){
  const delta=(a.optimizedScore||0)-(a.currentScore||0);
  const wins=a.topWins||a.topBenefits||[];
  return(
    <div style={{background:'white',borderRadius:16,padding:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',border:`1px solid ${C.g200}`,marginBottom:16}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:20,marginBottom:20}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:52,fontWeight:900,color:C.g400,lineHeight:1}}>{a.currentScore}</div>
          <div style={{fontSize:11,color:C.g400,fontWeight:700,marginTop:4,textTransform:'uppercase',letterSpacing:'0.06em'}}>Current</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
          <svg width={32} height={16} viewBox="0 0 32 16"><path d="M0 8 L24 8 M18 3 L24 8 L18 13" stroke={C.pink} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {delta>0&&<div style={{background:C.tealBg,color:C.teal,fontSize:13,fontWeight:800,padding:'3px 12px',borderRadius:20,border:`1px solid ${C.tealBorder}`}}>+{delta} pts</div>}
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:52,fontWeight:900,color:C.primary,lineHeight:1}}>{a.optimizedScore}</div>
          <div style={{fontSize:11,color:C.primary,fontWeight:700,marginTop:4,textTransform:'uppercase',letterSpacing:'0.06em'}}>Optimized</div>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {wins.slice(0,3).length>0&&(
          <div>
            <div style={{fontSize:11,fontWeight:800,color:C.teal,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Top Gains</div>
            {wins.slice(0,3).map((w,i)=>(
              <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:3}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:C.teal,marginTop:5,flexShrink:0}}/>
                <div style={{fontSize:13,color:C.g700,lineHeight:1.5}}>{typeof w==='string'?w:(w.title||w.item||w.win||'')}</div>
              </div>
            ))}
          </div>
        )}
        {(a.conflicts||[]).slice(0,3).length>0&&(
          <div>
            <div style={{fontSize:11,fontWeight:800,color:C.orange,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Top Issues</div>
            {(a.conflicts||[]).slice(0,3).map((c,i)=>(
              <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:3}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:C.orange,marginTop:5,flexShrink:0}}/>
                <div style={{fontSize:13,color:C.g700,lineHeight:1.5}}>{(c.items||[]).join(' + ')}</div>
              </div>
            ))}
          </div>
        )}
        {(a.positives_already_working||[]).slice(0,3).length>0&&(
          <div>
            <div style={{fontSize:11,fontWeight:800,color:'#059669',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>What's Already Working</div>
            {(a.positives_already_working||[]).slice(0,3).map((p,i)=>(
              <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:3}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#059669',marginTop:5,flexShrink:0}}/>
                <div style={{fontSize:13,color:C.g700,lineHeight:1.5}}>{p.strength}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMPONENT 2: SCHEDULE SECTION ──────────────────────────────────────────
function ScheduleSection({a,expanded,setExpanded}){
  return(
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {Object.entries(a.schedule||{}).map(([k,items])=>{
        if(!items||items.length===0)return null;
        const b=TB[k];
        if(!b)return null;
        return(
          <div key={k} style={{background:'white',borderRadius:16,padding:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',borderLeft:`4px solid ${b.color}`}}>
            <div style={{fontSize:13,fontWeight:700,color:b.color,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.08em'}}>{b.label}</div>
            <div style={{fontSize:12,color:C.g500,marginBottom:14}}>{b.time}</div>
            {items.map((it,i)=>{
              const key=`${k}-${i}`;
              const isOpen=expanded===key;
              const abs=it.absorption_profile;
              return(
                <div key={i}>
                  <div onClick={()=>setExpanded(prev=>prev===key?null:key)} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',padding:'12px 0',borderBottom:i<items.length-1&&!isOpen?`1px solid ${C.g100}`:'none',cursor:'pointer'}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:700,color:C.g900}}>{it.name}</div>
                      <div style={{fontSize:12,color:C.g500,marginTop:2}}>{it.dose}</div>
                      <div style={{fontSize:12,color:C.g600,marginTop:4,lineHeight:1.5}}>{it.instruction}</div>
                    </div>
                    <div style={{color:C.g400,fontSize:18,marginLeft:8,transition:'transform 0.2s',transform:isOpen?'rotate(180deg)':'none',flexShrink:0}}>▾</div>
                  </div>
                  {isOpen&&(
                    <div style={{background:C.g50,borderRadius:10,padding:'14px',marginBottom:i<items.length-1?8:0,border:`1px solid ${C.g100}`}}>
                      {abs&&(
                        <div style={{marginBottom:12}}>
                          <div style={{fontSize:11,fontWeight:800,color:C.g500,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Absorption Profile</div>
                          <div style={{fontSize:13,color:C.g700,marginBottom:4}}><strong>Best taken:</strong> {abs.bestTaken}</div>
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
                          <div style={{fontSize:11,fontWeight:800,color:C.g500,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Why it's here</div>
                          {(it.reason_for_move_explained||(it.reason?[it.reason]:[])).filter(Boolean).map((step,si)=>(
                            <div key={si} style={{fontSize:13,color:C.g700,lineHeight:1.6,marginBottom:4,paddingLeft:10,borderLeft:`2px solid ${si===0?C.primary:C.g300}`}}>{step}</div>
                          ))}
                        </div>
                      )}
                      {(it.real_world_impact||[]).length>0&&(
                        <div style={{marginBottom:12}}>
                          <div style={{fontSize:11,fontWeight:800,color:'#059669',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>What you'll notice</div>
                          {(it.real_world_impact||[]).map((imp,ii)=>(
                            <div key={ii} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:3}}>
                              <div style={{color:'#059669',flexShrink:0}}>✓</div>
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
                  {isOpen&&i<items.length-1&&<div style={{borderBottom:`1px solid ${C.g100}`,margin:'8px 0'}}/>}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── COMPONENT 3: CONFLICT CARDS ────────────────────────────────────────────
function ConflictCards({a,expanded,setExpanded}){
  const conflicts=(a.conflicts||[]).slice(0,5);
  if(conflicts.length===0)return(
    <div style={{background:'white',borderRadius:16,padding:'24px',textAlign:'center',color:C.g500,boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>No conflicts detected. Your routine is well-optimized!</div>
  );
  return(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {conflicts.map((c,i)=>{
        const sev=SEV[c.severity]||SEV.medium;
        const isOpen=expanded===i;
        return(
          <div key={i} style={{background:'white',borderRadius:16,boxShadow:'0 2px 12px rgba(0,0,0,0.06)',overflow:'hidden'}}>
            <div onClick={()=>setExpanded(prev=>prev===i?null:i)} style={{padding:'16px 20px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6,flexWrap:'wrap'}}>
                  <span style={{fontSize:11,fontWeight:800,color:sev.color,background:sev.bg,padding:'3px 10px',borderRadius:20}}>{sev.label}</span>
                  <span style={{fontSize:11,fontWeight:700,color:C.red,background:C.redBg,padding:'3px 10px',borderRadius:20}}>-{c.penalty} pts</span>
                </div>
                <div style={{fontSize:14,fontWeight:700,color:C.g900}}>{(c.items||[]).join(' + ')}</div>
              </div>
              <div style={{color:C.g400,fontSize:18,marginLeft:8,transition:'transform 0.2s',transform:isOpen?'rotate(180deg)':'none',flexShrink:0}}>▾</div>
            </div>
            {isOpen&&(
              <div style={{padding:'0 20px 20px'}}>
                <div style={{borderTop:`1px solid ${C.g100}`,paddingTop:14}}>
                  {c.user_context&&<p style={{margin:'0 0 12px',fontSize:13,color:C.g500,fontStyle:'italic',lineHeight:1.6}}>{c.user_context}</p>}
                  <p style={{margin:'0 0 12px',fontSize:14,color:C.g700,lineHeight:1.6}}>{c.issue}</p>
                  {c.absorption_loss_percent&&(
                    <div style={{background:C.redBg,borderRadius:10,padding:'12px 16px',marginBottom:12,border:'1px solid #FECACA'}}>
                      <div style={{fontSize:28,fontWeight:900,color:C.red,lineHeight:1}}>~{c.absorption_loss_percent}%</div>
                      <div style={{fontSize:12,fontWeight:700,color:C.red,marginTop:2}}>absorption loss</div>
                      <div style={{fontSize:12,color:'#991B1B',marginTop:6,lineHeight:1.5}}>At {c.absorption_loss_percent}% loss, you may be absorbing significantly less than your intended dose.</div>
                    </div>
                  )}
                  <div style={{background:C.tealBg,borderRadius:8,padding:'10px 14px',border:`1px solid ${C.tealBorder}`}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.teal,marginBottom:4}}>Recommended Fix</div>
                    <div style={{fontSize:13,color:C.mid,lineHeight:1.5}}>{c.recommendation}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── COMPONENT 4: SCORE BREAKDOWN CHART ─────────────────────────────────────
function ScoreBreakdownChart({a,expanded,setExpanded}){
  const breakdown=a.scoreBreakdown||[];
  if(breakdown.length===0)return(
    <div style={{background:'white',borderRadius:16,padding:'24px',textAlign:'center',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
      <div style={{fontSize:14,fontWeight:600,color:C.g700,marginBottom:8}}>Score breakdown not available for this report</div>
      <div style={{fontSize:13,color:C.g500}}>Overall improvement: {a.currentScore} → {a.optimizedScore} (+{(a.optimizedScore||0)-(a.currentScore||0)} pts)</div>
    </div>
  );
  return(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {breakdown.map((entry,i)=>{
        const isOpen=expanded===i;
        const before=entry.before??entry.currentScore??0;
        const after=entry.after??entry.optimizedScore??0;
        const delta=after-before;
        const max=entry.maxPoints||20;
        const beforePct=Math.min(100,(before/max)*100);
        const afterPct=Math.min(100,(after/max)*100);
        return(
          <div key={i} style={{background:'white',borderRadius:16,boxShadow:'0 2px 12px rgba(0,0,0,0.06)',overflow:'hidden'}}>
            <div onClick={()=>setExpanded(prev=>prev===i?null:i)} style={{padding:'16px 20px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <span style={{fontSize:14,fontWeight:700,color:C.g900}}>{entry.category}</span>
                  {delta>0&&<span style={{fontSize:12,fontWeight:800,color:'#059669',background:'#F0FDF4',padding:'2px 8px',borderRadius:20,border:'1px solid #BBF7D0'}}>+{delta} pts</span>}
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:12,color:C.g500,fontWeight:600,minWidth:20}}>{before}</span>
                  <div style={{flex:1,height:8,borderRadius:4,background:C.g100,overflow:'hidden',maxWidth:160,position:'relative'}}>
                    <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${beforePct}%`,background:C.g300,borderRadius:4}}/>
                    {delta>0&&<div style={{position:'absolute',left:`${beforePct}%`,top:0,height:'100%',width:`${afterPct-beforePct}%`,background:C.primary,borderRadius:4}}/>}
                  </div>
                  <span style={{fontSize:12,color:C.primary,fontWeight:700,minWidth:20}}>{after}</span>
                  <span style={{fontSize:11,color:C.g400}}>/{max}</span>
                </div>
              </div>
              <div style={{color:C.g400,fontSize:18,marginLeft:12,transition:'transform 0.2s',transform:isOpen?'rotate(180deg)':'none',flexShrink:0}}>▾</div>
            </div>
            {isOpen&&(
              <div style={{padding:'0 20px 20px'}}>
                <div style={{borderTop:`1px solid ${C.g100}`,paddingTop:14}}>
                  {(entry.actions_that_improved_score||[]).length>0&&(
                    <div style={{marginBottom:12}}>
                      <div style={{fontSize:11,fontWeight:800,color:C.teal,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>What improved this</div>
                      {(entry.actions_that_improved_score||[]).map((act,ai)=>(
                        <div key={ai} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:4}}>
                          <div style={{color:C.teal,flexShrink:0}}>✓</div>
                          <div style={{fontSize:13,color:C.g700,lineHeight:1.5}}>{act}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {entry.why_not_perfect&&(
                    <div style={{marginBottom:12}}>
                      <div style={{fontSize:11,fontWeight:800,color:C.g500,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Why not perfect</div>
                      <div style={{fontSize:13,color:C.g500,fontStyle:'italic',lineHeight:1.6}}>{entry.why_not_perfect}</div>
                    </div>
                  )}
                  {(entry.points_explanation||entry.explanation)&&(
                    <div style={{fontSize:12,color:C.g400,lineHeight:1.5}}>{entry.points_explanation||entry.explanation}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── COMPONENT 5: ASSUMPTIONS CHECKLIST ─────────────────────────────────────
function AssumptionsChecklist({a,checked,setChecked}){
  const[expandedInfo,setExpandedInfo]=useState(null);
  const assumptions=a.report_assumptions||[];
  if(assumptions.length===0)return(
    <div style={{background:'white',borderRadius:16,padding:'24px',textAlign:'center',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
      <div style={{fontSize:14,fontWeight:600,color:C.g700,marginBottom:8}}>No special assumptions</div>
      <div style={{fontSize:13,color:C.g500}}>All entries were recognized and no unusual timing assumptions were made.</div>
    </div>
  );
  return(
    <div>
      <div style={{background:'white',borderRadius:16,padding:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
        <div style={{fontSize:13,color:C.g600,lineHeight:1.6,marginBottom:16}}>Review the assumptions made in your report. Check each one after discussing with your pharmacist.</div>
        {assumptions.map((item,i)=>{
          const isChecked=!!checked[i];
          const isInfoOpen=expandedInfo===i;
          return(
            <div key={i} style={{borderBottom:i<assumptions.length-1?`1px solid ${C.g100}`:'none',paddingBottom:i<assumptions.length-1?16:0,marginBottom:i<assumptions.length-1?16:0}}>
              <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <div onClick={()=>setChecked(prev=>({...prev,[i]:!prev[i]}))} style={{width:24,height:24,borderRadius:6,border:`2px solid ${isChecked?C.primary:C.g300}`,background:isChecked?C.primary:'white',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0,marginTop:1,transition:'all 0.15s'}}>
                  {isChecked&&<svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:isChecked?400:600,color:isChecked?C.g400:C.g900,textDecoration:isChecked?'line-through':'none',lineHeight:1.5,marginBottom:6}}>{item.assumption}</div>
                  {item.pharmacistQuestion&&<div style={{fontSize:13,color:C.teal,fontStyle:'italic',lineHeight:1.5,marginBottom:6}}>Ask: "{item.pharmacistQuestion}"</div>}
                  <button onClick={()=>setExpandedInfo(prev=>prev===i?null:i)} style={{background:'none',border:'none',color:C.g400,fontSize:12,cursor:'pointer',padding:0,textDecoration:'underline'}}>
                    {isInfoOpen?'Hide info':'More info'}
                  </button>
                  {isInfoOpen&&(
                    <div style={{background:C.g50,borderRadius:8,padding:'10px 12px',marginTop:8,border:`1px solid ${C.g200}`}}>
                      <div style={{fontSize:13,color:C.g600,lineHeight:1.5,marginBottom:6}}>{item.whyItMatters}</div>
                      {item.importance&&<span style={{fontSize:11,fontWeight:700,color:item.importance==='high'?C.red:C.amber,background:item.importance==='high'?C.redBg:C.amberBg,padding:'2px 8px',borderRadius:20}}>Importance: {item.importance}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── COMPONENT 6: AI CHAT SECTION ───────────────────────────────────────────
function AIChatSection({a,chat,chatIn,setChatIn,chatLoad,sendChat,revisionPending,setRevisionPending,runRevision,advisorLocked,interactionCount,reportUpdateUsed,downloadReport,chatEnd}){
  return(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end',flexWrap:'wrap'}}>
        <span style={{fontSize:12,color:C.g500,background:'white',border:`1px solid ${C.g200}`,borderRadius:20,padding:'4px 12px'}}>Interactions: {interactionCount} of 15</span>
        <span style={{fontSize:12,color:reportUpdateUsed?C.g300:C.teal,background:'white',border:`1px solid ${reportUpdateUsed?C.g200:C.tealBorder}`,borderRadius:20,padding:'4px 12px'}}>Report updates: {reportUpdateUsed?0:1} of 1</span>
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
        <div style={{display:'flex',gap:10,background:'white',padding:12,borderRadius:14,boxShadow:'0 2px 12px rgba(0,0,0,0.06)',border:`1px solid ${C.g200}`}}>
          <input value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendChat()} placeholder="Ask about your medications, timing, or interactions..." style={{flex:1,border:'none',outline:'none',fontSize:14,color:C.g800,background:'transparent'}}/>
          <button onClick={sendChat} disabled={chatLoad||!chatIn.trim()} style={{background:chatIn.trim()&&!chatLoad?C.primary:C.g200,color:chatIn.trim()&&!chatLoad?'white':C.g400,border:'none',borderRadius:10,padding:'10px 14px',cursor:chatIn.trim()&&!chatLoad?'pointer':'default',display:'flex',alignItems:'center',gap:6,fontSize:13,fontWeight:700,transition:'all 0.15s'}}>
            {Ic.send(chatIn.trim()&&!chatLoad?'white':C.g400)}
            Send
          </button>
        </div>
      )}
    </div>
  );
}

// ─── COMPONENT 7: DOWNLOAD BUTTON ───────────────────────────────────────────
function DownloadButton({a,downloadReport}){
  const[downloaded,setDownloaded]=useState(false);
  const handleClick=()=>{downloadReport(a);setDownloaded(true);setTimeout(()=>setDownloaded(false),2500);};
  return(
    <button onClick={handleClick} style={{background:downloaded?'#059669':C.primary,color:'white',border:'none',borderRadius:8,padding:'8px 14px',fontSize:13,cursor:'pointer',fontWeight:700,display:'flex',alignItems:'center',gap:6,transition:'background 0.2s'}}>
      {downloaded?'✓ Downloaded!':<>{Ic.download()}Download PDF</>}
    </button>
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
  const[chat,setChat]=useState([{role:'assistant',content:"Hi, I'm your Absovex AI Advisor.\n\nI'm here to help you understand and refine your plan before you download.\n\nAsk about:\n• timing and spacing\n• interactions or conflicts\n• how to take something for better absorption\n\nIf something looks off or missing, I can help improve your schedule."}]);
  const[chatIn,setChatIn]=useState('');
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
  const[checkedAssumptions,setCheckedAssumptions]=useState({});

  // STRIPE STATE
  const[paymentStatus,setPaymentStatus]=useState(null); // 'processing', 'paid', 'failed', 'cancelled'
  const[promoCode,setPromoCode]=useState(''); // User enters BETA or other promo code
  const[stripeLoading,setStripeLoading]=useState(false);
  const[stripeErr,setStripeErr]=useState('');

  // ─── FORM FONT SCALE ────────────────────────────────────────────────────────
  const FLABEL={fontSize:fs(16),fontWeight:600,color:C.g500,display:'block',marginBottom:4};
  const FLABEL6={fontSize:fs(16),fontWeight:600,color:C.g500,marginBottom:6};
  const FLABEL8={fontSize:fs(16),fontWeight:600,color:C.g500,marginBottom:8};
  const FHELPER={margin:'5px 0 0',fontSize:fs(14),color:C.g400,lineHeight:1.5};
  const FBODY={fontSize:fs(16),color:C.g600};
  const FSS={...SS,fontSize:fs(16)};
  const FTOGGLE={fontSize:fs(16),color:C.g600};

  const updItem=(id,f,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[f]:v}:i));
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
    setTimeout(()=>chatEnd.current?.scrollIntoView({behavior:'smooth'}),100);
  };

  const sendChat=async()=>{
    if(!chatIn.trim()||chatLoad)return;
    if(interactionCount>=15)return;
    const msg=chatIn.trim();
    setChatIn('');
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
    setTimeout(()=>chatEnd.current?.scrollIntoView({behavior:'smooth'}),100);
  };

  const downloadReport=d=>{
    const date=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
    const improvement=((d.optimizedScore||0)-(d.currentScore||0));
    const sc2={high:{c:'#DC2626',bg:'#FEF2F2',l:'High Priority'},medium:{c:'#D97706',bg:'#FFFBEB',l:'Medium'},low:{c:'#0284C7',bg:'#F0F9FF',l:'Low'}};
    const blks={morning_fasting:{label:'Morning - Fasting',color:'#D97706',bg:'#FFFBEB',time:'Before food or coffee'},morning_with_breakfast:{label:'Morning - With Breakfast',color:'#EA580C',bg:'#FFF7ED',time:'With first meal'},midday:{label:'Midday',color:'#0284C7',bg:'#F0F9FF',time:'With or between meals'},evening_with_dinner:{label:'Evening - Dinner',color:'#7C3AED',bg:'#F5F3FF',time:'With evening meal'},bedtime:{label:'Bedtime',color:'#4338CA',bg:'#EEF2FF',time:'30 min before sleep'}};
    const ph=(n,t)=>`<div style="background:#0D7E7A;padding:20px 40px;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="color:#A8DCDC;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase">Page ${n}</div><h2 style="color:white;font-size:20px;font-weight:800;margin:4px 0 0">${t}</h2></div>`;
    const pf=n=>`<div class="pf" style="padding:8px 40px 14px;border-top:1px solid #F3F4F6;display:table;width:100%;box-sizing:border-box"><div style="display:table-row"><div style="display:table-cell;font-size:11px;color:#D1D5DB">Page ${n} — Absovex — ${date}</div><div style="display:table-cell;text-align:right;font-size:11px;color:#9CA3AF">absovex.com</div></div></div>`;
    const chip=txt=>`<span style="background:#E8F7F7;color:#0D7E7A;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600;display:inline-block;margin:2px 3px 2px 0;-webkit-print-color-adjust:exact;print-color-adjust:exact">${txt}</span>`;
    const h=`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Absovex Health Stack Report</title><style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:Georgia,serif;background:#F3F4F6;-webkit-print-color-adjust:exact;print-color-adjust:exact;}.page{max-width:750px;margin:0 auto 28px;background:white;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.09);}.pf{display:table;width:100%;}.running-footer{display:none;}@media print{body{background:white!important;}.page{box-shadow:none!important;border-radius:0!important;margin:0!important;max-width:100%!important;page-break-after:always;break-after:page;display:block!important;padding-bottom:50px!important;overflow:visible!important;}.page:last-child{page-break-after:avoid;}.pf{display:none!important;}.running-footer{display:table!important;position:fixed;bottom:0;left:0;right:0;width:100%;padding:8px 40px 14px;border-top:1px solid #F3F4F6;background:white;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}.no-print{display:none!important;}}@page{size:letter;margin:0.4in 0.5in;}</style></head><body>`;
    const printBtn=`<div class="no-print" style="background:#0D7E7A;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100"><span style="color:white;font-weight:700;font-size:14px">Absovex - Health Stack Report</span><button onclick="window.print()" style="background:white;color:#0D7E7A;border:none;border-radius:7px;padding:8px 18px;font-size:13px;font-weight:800;cursor:pointer">Print / Save PDF</button></div>`;
    const runningFooter=`<div class="running-footer"><div style="display:table-row"><div style="display:table-cell;font-size:11px;color:#D1D5DB">Absovex — ${date}</div><div style="display:table-cell;text-align:right;font-size:11px;color:#9CA3AF">absovex.com</div></div></div>`;
    const p1=`<div class="page"><div style="background:#0D7E7A;padding:32px 40px 28px;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="color:#A8DCDC;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:10px">Personalized Health Stack Report</div><h1 style="color:white;font-size:24px;font-weight:800;margin:0 0 5px">Absovex</h1><div style="color:#A8DCDC;font-size:13px;margin-bottom:22px">Generated ${date}</div><div style="display:table;width:100%"><div style="display:table-row"><div style="display:table-cell;padding-right:10px"><div style="background:rgba(0,0,0,0.2);border-radius:10px;padding:10px 14px;text-align:center;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="color:#FCD34D;font-size:22px;font-weight:800">${d.currentScore||'—'}</div><div style="color:rgba(255,255,255,0.6);font-size:10px;margin-top:2px">Current Score</div></div></div><div style="display:table-cell;padding-right:10px"><div style="background:rgba(0,0,0,0.2);border-radius:10px;padding:10px 14px;text-align:center;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="color:#86EFAC;font-size:22px;font-weight:800">${d.optimizedScore||'—'}</div><div style="color:rgba(255,255,255,0.6);font-size:10px;margin-top:2px">Optimized Score</div></div></div><div style="display:table-cell;padding-right:10px"><div style="background:rgba(0,0,0,0.2);border-radius:10px;padding:10px 14px;text-align:center;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="color:#86EFAC;font-size:22px;font-weight:800">+${improvement} pts</div><div style="color:rgba(255,255,255,0.6);font-size:10px;margin-top:2px">Improvement</div></div></div><div style="display:table-cell;padding-right:10px"><div style="background:rgba(0,0,0,0.2);border-radius:10px;padding:10px 14px;text-align:center;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="color:#FCD34D;font-size:22px;font-weight:800">${d.issueCount||0}</div><div style="color:rgba(255,255,255,0.6);font-size:10px;margin-top:2px">Issues Found</div></div></div></div></div></div><div style="padding:22px 40px"><div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:12px 16px;margin-bottom:16px;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="font-size:10px;font-weight:800;color:#92400E;text-transform:uppercase;margin-bottom:6px">Medical Disclaimer</div><p style="margin:0;font-size:10px;color:#92400E;line-height:1.7">This report is for informational and educational purposes only and is not medical, diagnostic, or treatment advice. It is based on user-provided information and may be incomplete or inaccurate. It does not replace a physician, pharmacist, or qualified healthcare professional. Always consult a professional before making changes to your medications, supplements, or routine. You are responsible for how you use this information.</p></div><h2 style="font-size:11px;font-weight:800;color:#111827;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.08em">Summary</h2><p style="font-size:13px;color:#374151;line-height:1.8;margin:0 0 14px">${d.scoreSummary||''}</p>${(d.routineInsights&&d.routineInsights.length>0)?`<div style="background:#E8F7F7;border:1px solid #A8DCDC;border-radius:8px;padding:12px 16px;margin-bottom:16px;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="font-size:11px;font-weight:800;color:#0D7E7A;margin-bottom:8px;text-transform:uppercase">Personalized Routine Insights</div>${d.routineInsights.map(i=>`<div style="font-size:12px;color:#0A6B68;line-height:1.6;margin-bottom:4px;padding-left:10px;border-left:2px solid #0D7E7A">${i}</div>`).join('')}</div>`:''}<div style="display:table;width:100%;border-collapse:separate;border-spacing:7px"><div style="display:table-row"><div style="display:table-cell;width:50%;vertical-align:top;background:#FEF2F2;border-radius:8px;padding:11px 13px;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="font-size:10px;font-weight:800;color:#DC2626;text-transform:uppercase;margin-bottom:7px">Top Issues</div>${(d.topIssues||[]).map(i=>`<div style="font-size:11px;color:#374151;margin-bottom:5px;padding-left:9px;border-left:2px solid #DC2626;line-height:1.5">${i.issue||i}</div>`).join('')}</div><div style="display:table-cell;width:50%;vertical-align:top;background:#E8F7F7;border-radius:8px;padding:11px 13px;padding-left:18px;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="font-size:10px;font-weight:800;color:#0D7E7A;text-transform:uppercase;margin-bottom:7px">Top Benefits</div>${(d.topBenefits||[]).map(b=>`<div style="font-size:11px;color:#374151;margin-bottom:5px;padding-left:9px;border-left:2px solid #0A6B68;line-height:1.5">${b}</div>`).join('')}</div></div></div>${(d.positives_already_working&&d.positives_already_working.length>0)?`<div style="margin-top:16px"><div style="font-size:10px;font-weight:800;color:#059669;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">What Is Already Working</div>${d.positives_already_working.map(p=>`<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:10px 14px;margin-bottom:8px;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="font-size:12px;font-weight:800;color:#059669;margin-bottom:3px">${p.strength}</div><div style="font-size:11px;color:#374151;line-height:1.6">${p.explanation}</div><div style="font-size:11px;color:#059669;margin-top:4px;font-style:italic">${p.impact}</div></div>`).join('')}</div>`:''}</div>${pf(1)}</div>`;
    const p2=`<div class="page"><div style="background:#0D7E7A;padding:20px 40px;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="color:#A8DCDC;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase">Page 2</div><h2 style="color:white;font-size:20px;font-weight:800;margin:4px 0 0">Your Optimized Daily Schedule</h2></div><div style="padding:14px 36px">${Object.entries(d.schedule||{}).filter(([k,v])=>v&&v.length>0).map(([blkKey,items])=>{const b=blks[blkKey]||{label:blkKey,color:'#6B7280',bg:'#F9FAFB',time:''};return`<div style="margin-bottom:12px;page-break-inside:avoid"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid ${b.color}44"><div style="width:4px;height:24px;background:${b.color};border-radius:3px;-webkit-print-color-adjust:exact;print-color-adjust:exact"></div><div><div style="font-weight:800;font-size:13px;color:${b.color}">${b.label}</div><div style="font-size:11px;color:#9CA3AF">${b.time}</div></div></div>${items.map((it,i)=>`<div style="padding:8px 10px;margin-bottom:4px;background:${i%2===0?b.bg:'white'};border-radius:6px;page-break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px"><div style="font-weight:700;font-size:13px;color:#111827">${it.name}</div><div style="background:${b.color};color:white;border-radius:20px;padding:2px 8px;font-size:10px;font-weight:800;-webkit-print-color-adjust:exact;print-color-adjust:exact">${it.dose}</div></div><div style="font-size:11px;color:#6B7280;margin-bottom:4px">${it.instruction}</div><div style="font-size:12px;color:#4B5563;line-height:1.5;font-style:italic">${it.reason||''}</div></div>`).join('')}</div>`;}).join('')}</div>${pf(2)}</div>`;
    const p3=`<div class="page">${ph(3,'Conflicts and Interaction Analysis')}<div style="padding:22px 40px">${(d.conflicts||[]).length>0?d.conflicts.map(c=>{const s=sc2[c.severity]||sc2.medium;return`<div style="border-left:5px solid ${s.c};border-radius:8px;padding:12px 16px;margin-bottom:12px;background:${s.bg};page-break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="margin-bottom:6px"><span style="font-size:11px;font-weight:800;color:${s.c};margin-right:6px">${s.l}</span><span style="font-size:11px;background:#FEF2F2;color:#DC2626;padding:2px 7px;border-radius:20px;font-weight:700;margin-right:6px">-${c.penalty}pts</span><span style="font-size:13px;font-weight:800;color:#111827">${c.items.join(' + ')}</span></div>${c.user_context?`<p style="margin:0 0 5px;font-size:11px;color:#6B7280;font-style:italic;line-height:1.5">${c.user_context}</p>`:''}<p style="margin:0 0 8px;font-size:12px;color:#374151;line-height:1.6">${c.issue}</p><div style="background:#E8F7F7;border-radius:5px;padding:7px 10px;-webkit-print-color-adjust:exact;print-color-adjust:exact"><span style="font-size:12px;color:#0D7E7A;font-weight:600">${c.recommendation}</span></div></div>`}).join(''):'<div style="padding:20px;text-align:center;color:#059669;font-size:14px">No conflicts detected in your routine.</div>'}</div>${pf(3)}</div>`;
    const p4=`<div class="page">${ph(4,'Optimization Logic')}<div style="padding:22px 40px">${(d.optimizationLogic||[]).length>0?d.optimizationLogic.map(l=>`<div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #F3F4F6;page-break-inside:avoid"><div style="margin-bottom:6px;line-height:1.7"><span style="font-weight:800;font-size:13px;color:#111827;margin-right:5px">${l.item}</span><span style="font-size:11px;background:#F3F4F6;color:#6B7280;padding:2px 8px;border-radius:20px;margin-right:5px">${fmtTime(l.oldTiming)}</span><span style="color:#D1D5DB;margin-right:5px">to</span><span style="font-size:11px;background:#E8F7F7;color:#0D7E7A;padding:2px 8px;border-radius:20px;font-weight:700;-webkit-print-color-adjust:exact;print-color-adjust:exact">${fmtTime(l.newTiming)}</span></div>${(l.reason_for_move_explained||[l.reason]).map((step,i)=>`<div style="font-size:12px;color:#4B5563;line-height:1.7;margin-bottom:4px;padding-left:10px;border-left:2px solid ${i===0?'#0D7E7A':'#D1D5DB'};-webkit-print-color-adjust:exact;print-color-adjust:exact">${step}</div>`).join('')}${l.real_world_benefit?`<div style="font-size:11px;color:#059669;margin-top:6px;font-weight:600">Impact: ${l.real_world_benefit}</div>`:''}</div>`).join(''):'<div style="padding:20px;color:#6B7280;font-size:13px">No timing changes needed.</div>'}</div>${pf(4)}</div>`;
    const p5=`<div class="page">${ph(5,'Quick Reference - Fridge Chart')}<div style="padding:22px 40px"><div style="border:2px solid #E5E7EB;border-radius:9px;overflow:hidden"><div style="background:#E8F7F7;padding:12px 18px;display:table;width:100%;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="display:table-row"><div style="display:table-cell;font-weight:800;font-size:14px;color:#0D7E7A">My Daily Health Stack</div><div style="display:table-cell;text-align:right;font-size:11px;color:#0A6B68">Score: ${d.optimizedScore}/100</div></div></div>${(d.quickReference||[]).map((row,i)=>`<div style="display:table;width:100%;border-top:1px solid #F3F4F6;background:${i%2===0?'white':'#F9FAFB'};-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="display:table-row"><div style="display:table-cell;width:170px;padding:10px 18px;vertical-align:top;font-weight:700;font-size:12px;color:#374151">${row.time}</div><div style="display:table-cell;padding:10px 18px 10px 0;vertical-align:top">${(row.items||[]).map(item=>chip(item)).join('')}</div></div></div>`).join('')}</div></div>${pf(5)}</div>`;
    const p6=`<div class="page">${ph(6,'Recommendations and Doctor Prompts')}<div style="padding:22px 40px">${(d.recommendations||[]).map(r=>`<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 12px;margin-bottom:7px;background:#F9FAFB;border-radius:7px;page-break-inside:avoid"><span style="background:#E8F7F7;color:#0D7E7A;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;white-space:nowrap;-webkit-print-color-adjust:exact;print-color-adjust:exact">${r.category}</span><span style="font-size:12px;color:#374151;line-height:1.5">${r.tip}</span></div>`).join('')}<div style="margin-top:16px;background:#EFF6FF;border-radius:9px;padding:14px 18px;border:1px solid #BFDBFE;-webkit-print-color-adjust:exact;print-color-adjust:exact"><h4 style="margin:0 0 10px;font-size:11px;font-weight:800;color:#1E40AF;text-transform:uppercase">Questions for Your Doctor</h4>${(d.doctorPrompts||[]).map(q=>`<div style="font-size:12px;color:#1D4ED8;margin-bottom:7px;padding-left:10px;border-left:3px solid #93C5FD;line-height:1.5">${q}</div>`).join('')}</div>${(d.report_assumptions&&d.report_assumptions.length>0)?`<div style="margin-top:14px;background:#F9FAFB;border-radius:9px;padding:14px 18px;border:1px solid #E5E7EB"><div style="font-size:10px;font-weight:800;color:#374151;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px">Report Assumptions</div>${d.report_assumptions.map(a=>`<div style="font-size:11px;color:#374151;margin-bottom:10px;padding-left:10px;border-left:3px solid #D1D5DB;line-height:1.6"><div style="font-weight:700">${a.assumption}</div><div style="color:#6B7280;margin-top:2px">${a.whyItMatters}</div>${a.pharmacistQuestion?`<div style="color:#0D7E7A;margin-top:4px;font-style:italic">Ask: "${a.pharmacistQuestion}"</div>`:''}</div>`).join('')}</div>`:''}
<div style="margin-top:12px;background:#FFF7ED;border-radius:7px;padding:10px 14px;border:1px solid #FED7AA"><p style="margin:0;font-size:10px;color:#92400E;line-height:1.6"><strong>Disclaimer:</strong> This report is for informational and educational purposes only and does not constitute medical advice, diagnosis, treatment, or pharmaceutical advice. It is based solely on user-submitted information and may be incomplete or inaccurate. Consult a physician, licensed pharmacist, or qualified healthcare professional before making any changes to your medication or supplement routine. Do not use this report for emergency medical decisions.</p></div></div>${pf(6)}</div>`;
    const html=h+printBtn+runningFooter+p1+p2+p3+p4+p5+p6+'</body></html>';
    const blob=new Blob([html],{type:'text/html'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download='ABSOVEX-Health-Stack-Report-'+date.replace(/\s+/g,'-')+'.html';
    a.click();
    URL.revokeObjectURL(url);
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
          <p style={{margin:'0 0 18px',fontSize:14,color:C.g500}}>Add everything you take - medications, supplements, vitamins, minerals, herbs.</p>
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
        </div>
        {err&&<div style={{background:C.redBg,border:`1px solid ${C.red}`,borderRadius:8,padding:'10px 14px',color:C.red,fontSize:14,marginBottom:12}}>{err}</div>}
        <button onClick={()=>{const f=items.filter(i=>i.name.trim());if(f.length<2){setErr('Please add at least 2 items.');return;}setErr('');setScreen('routine');}} style={{width:'100%',background:`linear-gradient(135deg,${C.primary},${C.mid})`,color:'white',border:'none',borderRadius:12,padding:15,fontSize:16,fontWeight:800,cursor:'pointer'}}>
          Next: Set My Daily Routine
        </button>
        <p style={{textAlign:'center',color:C.g500,fontSize:13,marginTop:8}}>Your data is private and never stored.</p>
      </div>
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
        <RRow icon={Ic.person()} title="About You" sub="Helps personalize advice for hormonal health, absorption, and age-related patterns">
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
        <RRow icon={Ic.coffee()} title="Morning Tea or Coffee" sub="Helps plan spacing for thyroid and other sensitive medications">
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
          {/* Score cards */}
          {(()=>{
            const scoreLabel=s=>s>=85?'Optimized':s>=70?'Good':s>=50?'Fair':'Needs Attention';
            const delta=(a.optimizedScore||0)-(a.currentScore||0);
            return(
              <>
                <div style={{display:'flex',alignItems:'stretch',gap:0,marginBottom:16,borderRadius:20,overflow:'hidden',boxShadow:'0 4px 24px rgba(13,126,122,0.08)',border:`1px solid ${C.g200}`}}>
                  {/* Current score card */}
                  <div style={{flex:1,background:'#EFF6FF',padding:'28px 24px',textAlign:'center'}}>
                    <div style={{fontSize:13,fontWeight:700,color:'#1D4ED8',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>Current</div>
                    <div style={{fontSize:56,fontWeight:800,color:'#1D4ED8',lineHeight:1}}>{a.currentScore}</div>
                    <div style={{fontSize:13,color:'#1D4ED8',marginTop:8,fontWeight:600}}>{scoreLabel(a.currentScore)}</div>
                  </div>
                  {/* Delta circle */}
                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',background:'white',padding:'0 16px',flexShrink:0}}>
                    <div style={{width:56,height:56,borderRadius:'50%',background:C.tealBg,border:`2px solid ${C.tealBorder}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                      <span style={{fontSize:15,fontWeight:800,color:C.primary,lineHeight:1}}>+{delta}</span>
                      <svg width={14} height={10} viewBox="0 0 14 10" style={{marginTop:2}}><path d="M0 5 L10 5 M7 1 L10 5 L7 9" stroke={C.primary} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  {/* Optimized score card */}
                  <div style={{flex:1,background:C.tealBg,padding:'28px 24px',textAlign:'center'}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.primary,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>Optimized</div>
                    <div style={{fontSize:56,fontWeight:800,color:C.primary,lineHeight:1}}>{a.optimizedScore}</div>
                    <div style={{fontSize:13,color:C.primary,marginTop:8,fontWeight:600}}>{scoreLabel(a.optimizedScore)}</div>
                  </div>
                </div>
                {/* Score explanation */}
                <p style={{fontSize:16,color:C.g600,lineHeight:1.7,marginBottom:20,textAlign:'left'}}>
                  Your Current Score reflects how your existing routine supports absorption and timing. Your Optimized Score shows what's possible with the recommended adjustments in your report.
                </p>
                {/* Issue preview */}
                {(()=>{
                  const topIssue=(a.conflicts&&a.conflicts.length>0)
                    ?[...a.conflicts].sort((x,y)=>(y.penalty||0)-(x.penalty||0))[0]
                    :(a.topIssues&&a.topIssues.length>0)?{issue:a.topIssues[0].issue||a.topIssues[0],items:[],recommendation:''}:null;
                  if(!topIssue)return null;
                  return(
                    <div style={{marginBottom:24}}>
                      <div style={{fontSize:16,fontWeight:700,color:C.g700,marginBottom:10}}>Here is one thing we found:</div>
                      <div style={{background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:14,padding:'16px 20px'}}>
                        {topIssue.items&&topIssue.items.length>0&&<div style={{fontSize:14,fontWeight:700,color:C.primary,marginBottom:6}}>{topIssue.items.join(' + ')}</div>}
                        <p style={{margin:0,fontSize:16,color:C.dark,lineHeight:1.6}}>{topIssue.issue}</p>
                        {topIssue.recommendation&&<div style={{marginTop:10,fontSize:15,color:C.mid,fontWeight:600}}>Fix: {topIssue.recommendation}</div>}
                      </div>
                      <p style={{fontSize:16,color:C.g500,marginTop:12,textAlign:'left'}}>Your full report includes all identified issues, a personalized schedule, and recommendations.</p>
                    </div>
                  );
                })()}
              </>
            );
          })()}

          {/* Paywall section */}
          <div style={{background:`linear-gradient(150deg,${C.primary} 0%,${C.mid} 60%,${C.light} 100%)`,borderRadius:24,padding:'32px 28px',boxShadow:'0 8px 32px rgba(13,126,122,0.3)'}}>
            <div style={{marginBottom:24}}>
              <div style={{color:'rgba(255,255,255,0.8)',fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:8}}>ABSOVEX Full Report</div>
              <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:6}}>
                <span style={{color:'white',fontSize:52,fontWeight:800,lineHeight:1}}>$29</span>
              </div>
              <div style={{color:'rgba(255,255,255,0.7)',fontSize:16,marginBottom:0}}>One-time · Instant access · Downloadable PDF</div>
            </div>
            <div style={{background:'rgba(255,255,255,0.1)',borderRadius:14,padding:'18px 20px',marginBottom:24}}>
              <div style={{color:'white',fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:14}}>What is inside your report</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {['Full optimized daily schedule','All conflicts and how to fix them','Personalized routine insights','Printable fridge chart','Food and absorption tips','Questions for your doctor','AI Health Advisor chat','Full score breakdown'].map(text=>(
                  <div key={text} style={{display:'flex',alignItems:'flex-start',gap:8,color:'white',fontSize:16}}>
                    <span style={{width:18,height:18,borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>
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
              {stripeLoading?'Processing...':paymentStatus==='paid'?'Proceeding to Report...':'Get Full Report - $29'}
            </button>

            {paymentStatus!=='paid'&&(
              <p style={{color:'rgba(255,255,255,0.6)',fontSize:12,textAlign:'center',margin:0}}>No account needed - Instant access after checkout</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS ────────────────────────────────────────────────────────────────
  if(screen==='results'&&result){
    const a=result;
    const advisorLocked=interactionCount>=15;
    const tabs=[
      {id:'schedule',label:'Schedule'},
      {id:'conflicts',label:`Conflicts (${(a.conflicts||[]).length})`},
      {id:'score',label:'Score Breakdown'},
      {id:'assumptions',label:'Assumptions'},
      {id:'recommendations',label:'Recommendations'},
      {id:'chat',label:'Absovex AI Advisor',pink:true},
    ];
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
              <DownloadButton a={a} downloadReport={downloadReport}/>
              <button onClick={()=>{setScreen('routine');setPaymentStatus(null);}} style={{background:'none',border:`1px solid ${C.tealBorder}`,color:C.primary,borderRadius:8,padding:'8px 12px',fontSize:13,cursor:'pointer'}}>Edit</button>
            </div>
          </div>
        </div>

        <div style={{maxWidth:700,margin:'0 auto',padding:'20px'}}>
          <div onClick={()=>setTab('chat')} style={{background:'#FFF0F8',border:'1px solid #FFADD8',borderRadius:10,padding:'10px 16px',marginBottom:12,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:14}}>✨</span>
            <span style={{fontSize:13,color:'#C0186A',fontWeight:600}}>Optimize your plan with the Absovex AI Advisor before you download.</span>
          </div>
          <ScoreSummaryCard a={a}/>
          <div style={{display:'flex',gap:8,marginBottom:20,background:'white',padding:'6px',borderRadius:12,boxShadow:'0 1px 4px rgba(0,0,0,0.05)',border:`1px solid ${C.g200}`,overflowX:'auto'}}>
            {tabs.map(t=>{
              const isActive=tab===t.id;
              const isPink=t.pink;
              return(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,minWidth:100,padding:'10px 14px',borderRadius:10,background:isActive?(isPink?'#FF4DAD':C.primary):'transparent',color:isActive?'white':(isPink?'#FF4DAD':C.g600),border:isActive?'none':(isPink?'1px solid #FF4DAD':'none'),cursor:'pointer',fontSize:13,fontWeight:isActive?700:500,whiteSpace:'nowrap'}}>
                  {t.label}
                </button>
              );
            })}
          </div>

          {tab==='schedule'&&<ScheduleSection a={a} expanded={expandedScheduleItem} setExpanded={setExpandedScheduleItem}/>}

          {tab==='conflicts'&&<ConflictCards a={a} expanded={expandedConflict} setExpanded={setExpandedConflict}/>}

          {tab==='score'&&<ScoreBreakdownChart a={a} expanded={expandedScore} setExpanded={setExpandedScore}/>}

          {tab==='assumptions'&&<AssumptionsChecklist a={a} checked={checkedAssumptions} setChecked={setCheckedAssumptions}/>}

          {tab==='recommendations'&&(
            <div>
              {(a.recommendations||[]).length>0&&(
                <div style={{background:'white',borderRadius:16,padding:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',marginBottom:16}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.g700,marginBottom:14,textTransform:'uppercase',letterSpacing:'0.08em'}}>Personalized Recommendations</div>
                  {(a.recommendations||[]).map((r,i)=>(
                    <div key={i} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:i<(a.recommendations.length-1)?`1px solid ${C.g100}`:'none'}}>
                      <span style={{background:C.tealBg,color:C.teal,fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20,whiteSpace:'nowrap',alignSelf:'flex-start'}}>{r.category}</span>
                      <span style={{fontSize:14,color:C.g700,lineHeight:1.6}}>{r.tip}</span>
                    </div>
                  ))}
                </div>
              )}
              {(a.doctorPrompts||[]).length>0&&(
                <div style={{background:C.blueBg,border:`1px solid ${C.blueBorder}`,borderRadius:16,padding:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:14,textTransform:'uppercase',letterSpacing:'0.08em'}}>Questions for Your Doctor</div>
                  {(a.doctorPrompts||[]).map((q,i)=>(
                    <div key={i} style={{display:'flex',gap:10,padding:'10px 0',borderBottom:i<(a.doctorPrompts.length-1)?`1px solid ${C.blueBorder}`:'none'}}>
                      <div style={{width:20,height:20,borderRadius:'50%',background:C.blue,color:'white',fontSize:11,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>{i+1}</div>
                      <div style={{fontSize:14,color:'#1E3A8A',lineHeight:1.6}}>{q}</div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{background:'#FFF7ED',border:'1px solid #FED7AA',borderRadius:12,padding:'12px 16px',marginTop:16}}>
                <div style={{fontSize:12,color:'#92400E',lineHeight:1.6}}><strong>Disclaimer:</strong> This report is for informational and educational purposes only and does not constitute medical advice, diagnosis, treatment, or pharmaceutical advice. Consult a physician, licensed pharmacist, or qualified healthcare professional before making any changes to your medication or supplement routine.</div>
              </div>
            </div>
          )}

          {tab==='chat'&&<AIChatSection a={a} chat={chat} chatIn={chatIn} setChatIn={setChatIn} chatLoad={chatLoad} sendChat={sendChat} revisionPending={revisionPending} setRevisionPending={setRevisionPending} runRevision={runRevision} advisorLocked={advisorLocked} interactionCount={interactionCount} reportUpdateUsed={reportUpdateUsed} downloadReport={downloadReport} chatEnd={chatEnd}/>}

        </div>
      </div>
    );
  }

  return null;
}
