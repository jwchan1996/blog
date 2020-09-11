---
title: Flutter 读取应用资源并显示
date: 2020-09-11
categories: "flutter" #分类
tags:  #标签
    - flutter
    - markdown
---

# Flutter 读取应用资源并显示

在 `flutter` 中，如果需要加载资源的话，需要在 `pubspec.yaml` 指定 `APP` 所需要的资源。

这样的话，指定的每个 `Asset` （资源）都会被打包在 `APP` 中，并且在 `APP` 运行时可以访问到这些资源。

最常见的 `Asset` 类型就是图片，指定图片资源后既可以在 `APP` 页面使用图片组件加载资源了。

```yaml
# pubspec.yaml

flutter:
    assets:
        - assets/images/logo.png
```

```dart
// lib/main.dart

Image.asset('assets/images/logo.png')
```

## 使用 rootBundle 对象访问资源

`APP` 可以通过引入 `services` 包使用 `rootBundle` 对象来访问资源。

```dart
import 'package:flutter/services.dart';
```

比如访问文件 `test.txt`，`txt` 文件内容是 `测试文字`，可以使用 `rootBundle` 对象的 `loadString` 方法。

当然，前提也是需要在 `pubspec.yaml` 中指定资源才能访问的到。

```dart
rootBundle.loadString('assets/txt/test.txt').then((data){
    print(data);
});

// 测试文字
```

因为 `loadString()` 返回的是 `Future<String>`，所以需要用 `then()` 接受返回的 `String` 类型的数据，`Future` 类似于 `ES6` 中的 `Promise`，当异步任务执行完成后会把结果返回给 `then()`。 

## 使用 FutureBuilder 控件配合加载资源

`FutureBuilder` 控件可以根据 `Future` （异步）任务的进度进行不同的处理。

`FutureBuilder` 有三个子属性，分别是：

- `future` 获取用户异步处理获得数据的代码
- `initialData` 初始化数据加载
- `builder` 回调函数，处理异步处理中的快照，即异步处理的每一步状态变化都会触发回调函数

具体回调参数对象的属性可以自行网上查询。

下面是一段配合 `FutureBuilder` 控件实现的加载 `markdown` 文件并使用 `markdown_widget` 包进行解析显示到页面。

同样是需要在 `pubspec.yaml` 进行资源指定，可以使用指定文件夹的形式，当前文件夹的资源都会被放进 `AssetBundle`。

```yaml
# pubspec.yaml

flutter:
    assets:
        - assets/md/
```

加载并显示 `markdown` 文件：

```dart
// 引入必要的包

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:markdown_widget/markdown_widget.dart';
```

```dart
@override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('文本组件'), centerTitle: true),
      body: Container(
        margin: EdgeInsets.all(15),
        child: FutureBuilder(
          future: rootBundle.loadString('assets/md/text.md'),
          builder: (BuildContext context, AsyncSnapshot snapshot) {
            if (snapshot.hasData) {
              // 判断已经返回数据则让 markdown 解析控件进行解析显示
              return MarkdownWidget(data: snapshot.data);
            } else {
              return Center(
                child: Text("加载中..."),
              );
            }
          },
        ),
      ),
    );
  }
```

效果如下：

![markdown.png](~public/flutter/flutter_load_asset/markdown.png)