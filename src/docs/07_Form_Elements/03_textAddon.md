Creates text input with addon in front or end.

Default placement is `before`.

```php
FormItem::textAddon('url', 'Url')->addon('http://my-site.com/')->placement('before')
```

![](/img/text_addon.png)


```php
FormItem::textAddon('price', 'Price')->addon('$')->placement('after')
```

![](/img/text_addon_after.png)