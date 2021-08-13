# 老爸的私房錢
**一個使用 Node.js + Express 打造的記帳程式。**

## 產品功能如下：
 * 使用者可以新增一筆支出
 * 使用者可以瀏覽所有的支出
 * 使用者可以瀏覽各項分類的支出
 * 使用者可以修改一筆支出
 * 使用者可以刪除一筆支出

## 新增功能
 * 加入使用者認證功能
 * 除了現在的資料，使用者可以在每筆支出加上「商家 (merchant)」這個欄位
 * 在首頁，使用者可以同時根據「類別」與「月份」來篩選支出；總金額的計算只會包括被篩選出來的支出總和
 
 ## 環境建置：
 1. Mongodb
 2. Node.js
 
 ## 登入資料：
 * email:user1@example.com  
 * password:12345678
 
 ## 下載方法：
 1. 打開終端機，Clone 此專案至本機電腦
 
```
git clone https://github.com/haru5386/expense-tracker
```

2. 進入存放此專案的資料夾

```
cd expense-tracker
```

3. 安裝 npm 套件，

```
npm install
```

4. 修改.env檔案名稱

```
mv .env.expamle .env
```

5. 加入種子資料

```
npm run seed
```

6. 啟動網頁伺服器

```
npm run dev
```

7. 顯示`It's running on http://localhost:3000 mongodb connected`
   表示成功進入
