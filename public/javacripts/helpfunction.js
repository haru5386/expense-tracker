const functions = {
  // 總和
  total: function (Record) {
    let total = 0
    Record.forEach((record) => {
      total += Number(record.amount)
    })
    return total
  },

  // 轉換日期格式
  changeDateformat: function (date) {
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    return y + '-' + m + '-' + d
  },

  // 判斷搜尋結果是否為空
  isEmpty: function (obj) {
    for (i in obj) {
      if (i) {
        return false
      }
    }
    return true
  }
}
module.exports = functions
