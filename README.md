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

1. 将本项目 clone 到本地
1. 多人协作开发时，最好一打开电脑，马上先 pull，拉取最新的。然后进行常规开发，开发完毕之后，在 commit 之前，也使用 pull 再拉取一遍。随后再 commit , push

## 进度

- [x] 元器件库结构体
  - [x] 新建元器件库结构体相关文件：xxx.js yyy.js
  - [x] 结构体设计
  - [x] 在jQuery对象中添加成员函数.xxx(yyy)，调用之后可以在对应DOM对象下使用svg画出对应元器件
  - [x] _◎提供接口函数xxx(yyy, zzz1, ...)，调用之后可以添加元器件_

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

### js/test/\*.js 与 js/main.js 的区别

相比其它js脚本文件， js/test/\*.js 与 js/main.js 都会按 index.html 中的顺序运行，其它js文件则只有函数，不应直接运行。但是 js/main.js 会同步到Github仓库，而git commit时会忽略 js/test/ 中的所有文件（由 .gitignore 指定）。所以Github仓库中的 js/test/ 不包含任何文件，需要在各自的本地仓库新建。新建时建议取名为 js/test/test.js ，否则需要在 index.html 加入新文件。当然也可以直接在 js/test/ 中新建html文件和js文件来测试，这种修改就完全不会对服务器产生影响。其结果就是服务器上的 index.html 只运行 js/main.js，本地可能会额外运行 js/test/\*.js，供测试用。