class Utils {

    static dateFormat(date){

        const newDate = new Date(date);

        return `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`
      //return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }
}