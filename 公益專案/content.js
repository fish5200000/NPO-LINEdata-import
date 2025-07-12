(function(){
    console.log("LINE Pay Scraper 啟動中...");
  
    const tableRows = document.querySelectorAll("table tbody tr");
    if(tableRows.length === 0){
      console.log("找不到表格，請確認是否在訂單列表頁。");
      return;
    }
  
    const rows = [];
    rows.push([
      "訂單編號",
      "交易編號",
      "商品名稱",
      "總金額",
      "訂購日",
      "捐款人",
      "聯絡電話",
      "電子郵件"
    ]);
  
    // 專門處理含逗號和引號的值
    const safe = (s) => {
      if (!s) return "";
      if (s.includes('"')) s = s.replace(/"/g, '""');
      if (s.includes(",") || s.includes("\n")) return `"${s}"`;
      return s;
    };
  
    tableRows.forEach(tr => {
      const tds = tr.querySelectorAll("td");
      if (tds.length >= 11) {
        // 印出每列供檢查
        console.log(Array.from(tds).map(td => td.innerText.trim()));
  
        const orderNumber = tds[2]?.innerText.trim();
        const transactionNumber = tds[3]?.innerText.trim();
        const product = tds[5]?.innerText.trim();
        const amount = tds[6]?.innerText.trim();
        const date = tds[7]?.innerText.trim();
        const donor = tds[8]?.innerText.trim();
        const phone = tds[9]?.innerText.trim();
        const email = tds[10]?.innerText.trim();
  
        rows.push([
          safe(orderNumber),
          safe(transactionNumber),
          safe(product),
          safe(amount),
          safe(date),
          safe(donor),
          safe(phone),
          safe(email)
        ]);
      }
    });
  
    console.log("擷取完成，共", rows.length - 1, "筆。");
  
    const BOM = "\uFEFF";
    const csvContent = "data:text/csv;charset=utf-8," + BOM + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "linepay_orders_full.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  })();