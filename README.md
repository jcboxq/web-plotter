# web-plotter
Web Plotter
网页版绘图器

## 快速上手参考资料

### 有用的手册

* [HTML5 canvas 参考手册](https://www.runoob.com/tags/ref-canvas.html)
* [JavaScript HTML DOM 事件方法](https://www.runoob.com/js/js-htmldom-eventlistener.html)

### 魔改素材

目前找到两个，把仓库 clone 到本地后，用浏览器打开相应 .html 文件可查看效果。

* 涂鸦板，在[examples/plot_freestyle.html](https://github.com/jcboxq/web-plotter/blob/main/examples/plot_freestyle.html)
* 画函数，在[examples/plot_function](https://github.com/jcboxq/web-plotter/tree/main/examples/plot_function)

## 进度

- [ ] 涂鸦板
- [ ] 画函数：用户给定 f(x)
    - [ ] 用户鼠标滑轮、拖动改变可视范围
- [ ] 画平面几何：用户选择画固定形状或者任意多边形（参考 Word 的“插入形状”功能）
    - [ ] 画固定形状（三角形、矩形、圆）：用户在画布上框选绘制区域
    - [ ] 画任意多边形：用户鼠标点击选择顶点位置
- [ ] 画方程曲线：用户给定圆锥曲线方程系数，我们视情况确定初始可视范围

## 目录结构

| 目录 | 说明 |
| --- | --- |
| external/ | 外部依赖库 |
| external/bootstrap/ | 著名的CSS框架 |
| external/jquery/ | 著名的javascript库 |
| js/ | 自己编写的针对该项目不同模块的javascript脚本 |
| examples/ | 一些前端编程教学样例 |
| index.html | HTML主页 |
| README.md | 说明文档 |

## 代码规范（重要）

### 代码格式化

下载
[Visual Studio Code](https://code.visualstudio.com/docs/?dv=win)
，安装后打开VSCode的设置（快捷键Ctrl+逗号，或者依次按Alt+F、P、S、Enter）：

```javascript
{
    "editor.tabSize": 2
}
```
使用其它编辑器如 Notepad++, UltraEdit 的，参照已完成的代码（特别是 js/main.js）和下一小节的代码风格更改编辑器代码格式化的相关设置。尽量不要使用记事本。

### 代码风格

以下规范重要性依次递减：

1. 缩进使用2个空格，既不是4个空格也不是1个制表符
1. 正确缩进
1. 左大括号不放置在新行
1. 重要的变量名、函数名（特别是需要给其它模块使用的）用驼峰式命名法
   1. 能够从名字看出其作用，类似 xSpace ， plotPoint(...)
   1. 全局变量加 glb 前缀，避免冲突，如 glbComponents
   1. 函数名一般包括一个谓语，一个宾语，两个完整单词造成冲突的可能性较低，如 appendComponent
1. 不要过分注释
1. 尽量注释
1. 行末不要留空白字符

## Github的使用

1. 将本项目 `clone` 到本地
1. 多人协作开发时，最好一打开电脑，马上先 `pull`，拉取最新的。然后进行常规开发，开发完毕之后，在 `commit` 之前，也使用 `pull` 再拉取一遍。随后再 `commit` , `push`