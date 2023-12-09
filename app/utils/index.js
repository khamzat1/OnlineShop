 import moment from "moment"
 
 export default{
     ifequal(a,b,options){
         if(a==b){
         return options.fn(this)
     }
     return options.inverse(this)
 },
  getFullNameFirsCharacter(firstName,lastName){
     return firstName.charAt(0)+ lastName.charAt(0)
  },
  
 formatData(data){
    return moment(data).format('DD MMM YYYY')
 }  
}
 