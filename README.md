# Lưu ý:

### Trước khi làm việc cần pull repon về local:
    * "git pull origin master" 
    * nếu ở local đã có thay đổi, github yêu cầu commit or stash thì làm như sau:
      ** b1: git stash save
      ** b2: git pull origin master
      ** b3: git stash pop
      ** b4: xử lí conflict (nếu có)

### Tiếp theo, Checkout tới đúng branch của mình (Không làm việc trên branch master)
    - ví dụ Hoàng (dev-hoang)
    * "git checkout dev-hoang"
### Sau khi kết thúc phiên làm việc thì push đúng Branch của mình
    - ví dụ Hoàng (dev-hoang)
    * git add .
    * git commit -m "something"
    * "git push origin dev-hoang"
### Khi đã làm xong chức năng yêu cầu, cần Pull Request cho Lead
    * lên trang github vào repo của project rồi tạo pull request


### Khi bị conflict nếu không biết xử lí thì liên hệ Lead

