# HƯỚNG DẪN CÀI ĐẶT REDIS LOCALHOST

## Trên Ubuntu VPS
Chạy các lệnh sau để cài đặt Redis:

sudo apt update && sudo apt install redis -y
sudo systemctl start redis
sudo systemctl enable redis-server

## Kiểm tra Redis đang chạy:
redis-cli ping

Nếu kết quả trả về PONG, Redis đã hoạt động thành công.

