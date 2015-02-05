### Error: `admin/js/en/lang.js` file not found

**Solution:**

Add this code to your nginx configuration:
```
location ~* ^(!?admin\/).+\.(jpg|jpeg|gif|css|png|js|ico|bmp)$ {
    log_not_found   off;
    access_log      off;
    expires         10d;
    break;
}
```
