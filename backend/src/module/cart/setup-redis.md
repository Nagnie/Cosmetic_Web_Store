# HƯỚNG DẪN CÀI ĐẶT REDIS LOCALHOST

## Trên Ubuntu VPS
Chạy các lệnh sau để cài đặt Redis:

## Đối với WSL 2
sudo apt update && sudo apt install redis -y
sudo systemctl start redis
sudo systemctl enable redis-server

## Đối với WSL 1
sudo apt update && sudo apt install redis -y
sudo service redis-server start
### Kiểm tra xem đã chạy chưa:
sudo service redis-server status
### Auto run
#### Mở file .bashrc:
nano ~/.bashrc
#### Thêm vào cuối file:
sudo service redis-server start
#### Tải lại .bashrc:
source ~/.bashrc

## Kiểm tra Redis đang chạy:
redis-cli ping
Nếu kết quả trả về PONG, Redis đã hoạt động thành công.

