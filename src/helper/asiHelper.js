export {activeHeaderTab , monumentRegionSelection, getMonumentListAccRegion, getMonumentListAccState,previousTabActive, nextTabActive,getMonumentListAccCity}

function activeHeaderTab(scrollHeight) {
   let  selectedTab 
   let ticketInfoHeight = document.getElementById('monument-ticket-info') ? document.getElementById('monument-ticket-info').offsetHeight : 0
   if(scrollHeight+50 > (ticketInfoHeight +document.getElementById('monument-carousel').offsetHeight + document.getElementById('monument-description').offsetHeight +document.getElementById('monument-information').offsetHeight )){
     selectedTab = 'hotel'
   } else if(scrollHeight+50 > (document.getElementById('monument-carousel').offsetHeight + document.getElementById('monument-description').offsetHeight +document.getElementById('monument-information').offsetHeight )){
     selectedTab = 'ticket'
   } else if(scrollHeight+50 > (document.getElementById('monument-carousel').offsetHeight + document.getElementById('monument-description').offsetHeight)){
     selectedTab = 'information'
   } else if(scrollHeight+50 > (document.getElementById('monument-carousel').offsetHeight)){
      selectedTab = 'about'
   } else {
      return '' 
   }
   return selectedTab 
}

function monumentRegionSelection (list) {
  let listAccordingtoRegion = {
    'INDIA':list,
    'NORTH' : [],
    'SOUTH' :[],
    'WEST' :[],
    'EAST' : [],
    'CENTRAL':[]
  }
  for(let i=0 ;i < list.length ;i++){
    switch (list[i].region) {
    case 'NORTH':
        listAccordingtoRegion['NORTH'].push(list[i])
        break;
    case 'SOUTH':
        listAccordingtoRegion['SOUTH'].push(list[i])
        break;
    case 'WEST':
        listAccordingtoRegion['WEST'].push(list[i])
        break;
    case 'EAST':
        listAccordingtoRegion['EAST'].push(list[i])
        break;
    case 'CENTRAL':
        listAccordingtoRegion['CENTRAL'].push(list[i])
        break;    
     }
  }
  return listAccordingtoRegion
}

function getMonumentListAccRegion (list,region){
  if(region == 'INDIA') {
    return list['INDIA']
  } else {
    return list[region]
  }
}

function getMonumentListAccState (list,state) {
  let listData = []
  for(let i=0; i< list.length ;i++){
    if(list[i].stateName && (list[i].stateName.toLowerCase() == state.toLowerCase())) {
      listData.push(list[i])
    }
  }
  return listData
}

function getMonumentListAccCity(list,city){
  let listData = []
  for(let i=0; i< list.length ;i++){
    if(list[i].cityName && (list[i].cityName.toLowerCase() == city.toLowerCase())) {
      listData.push(list[i])
    }
  }
  return listData
}

function previousTabActive (tabActive){
    let setActiveTab;
    switch (tabActive) {
    case 'most_popular':
        setActiveTab = 'south_india'
        break;
    case 'north_india':
        setActiveTab = 'most_popular'
        break;
    case 'south_india':
        setActiveTab = 'north_india'
        break;
   }
   return setActiveTab
}

function nextTabActive (tabActive) {
  let setActiveTab;
    switch (tabActive) {
    case 'most_popular':
        setActiveTab = 'north_india'
        break;
    case 'north_india':
        setActiveTab = 'south_india'
        break;
    case 'south_india':
        setActiveTab = 'most_popular'
        break;
   }
   return setActiveTab
}