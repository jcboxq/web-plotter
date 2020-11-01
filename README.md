# web-plotter
Web Plotter 
网页版绘图器

## 代码规范（重要）

### 代码格式化

下载
[Visual Studio Code](https://code.visualstudio.com/docs/?dv=win)
，安装后打开VSCode的设置（快捷键Ctrl+逗号，或者依次按Alt+F、P、S、Enter）：

```javascript
{
    "editor.tabSize": 4
}
```
使用其它编辑器如 Notepad++, UltraEdit 的，参照已完成的代码（特别是 js/main.js）和下一小节的代码风格更改编辑器代码格式化的相关设置。尽量不要使用记事本。

### 代码风格

以下规范重要性依次递减：

1. 缩进使用4个空格，既不是2个空格也不是1个制表符
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

## 进度

以下斜体部分可先不完成

- [ ] 画板：用户可选择**拖动坐标系位置**或**画笔**
- [ ] 函数：用户给定 f(x) 和 x 的初始范围
    - [ ] *用户鼠标滑轮改变 x 的取值范围*
- [ ] 平面几何：用户选择画圆或者多边形
    - [ ] 画圆：用户给定圆心和半径
    - [ ] 多边形：用户鼠标点击选择顶点位置
- [ ] 曲线：用户选择绘制一次或者二次（圆锥）曲线；用户给定相应方程系数；我们视情况确定 x 的取值范围

未完待续...

## 目录结构

表格是一些重要的简略说明，有必要详细说明的附在后续的几个小标题中。

| 目录 | 说明 |
| --- | --- |
| assets/ | 可大量拷贝的静态资源 |
| assets/image/ | 图像资源 |
| assets/js/ | 自己编写的javascript脚本库 |
| external/ | 外部依赖库 |
| external/bootstrap/ | 著名的CSS框架 |
| external/jquery/ | 简化javascript的DOM操作 |
| js/ | 自己编写的针对该特定项目的javascript脚本 |
| js/test/\*.js | 可在此处新建测试脚本（需要添加到index.html中） |
| js/main.js | 相当于main函数（仅在此处调用各个js文件的函数） |
| Examples/ | 之前编写的样例，现迁移至Github |
| index.html | HTML主页 |
| README.md | 说明文档 |
| .gitignore | git commit时忽略此文件中对应的文件 |