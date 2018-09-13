export const textHighlight = (searchText, presentValue) => {
    var text = new RegExp(searchText.toLowerCase())
    return presentValue.toLowerCase().replace(text,"<span style='color:#ea2330'>"+searchText+'</span>').toUpperCase()
}

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const dateFormat = (date) => {
    var d = new Date(parseFloat(date))
    var dd = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
    var nd = d.getMonth() < 9 ? '0'+(d.getMonth() + 1) : d.getMonth() + 1
    return d.getFullYear()+'-'+ nd +'-'+dd
}