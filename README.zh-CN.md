[English](./README.md) | 简体中文


# mayfly-cli 
----
用于搭建web项目的简单命令行工具  

## 安装 

```
npm install -g mayfly-cli
```

## 用法 

```
mayfly init <template-name> <project-name>
```

**示例:**    

```
mayfly init react my-project
```

## 项目模板

当前可用的模板包括：  

- react 基于 Webpack + React 的单页应用程序模版  

可以通过以下命令查看当前可用模板

```
mayfly list
```
### 自定义模板
如果官方模板无法满足你的使用需求，你可以基于官方模板进行自定义, 使用Github等仓库进行托管，并通过mayfly-cli进行使用：  

```
mayfly init username/repo my-project
```

其中 username/repo 是Github账户/仓库名称的简写，内部使用 [download-git-repo](https://gitlab.com/flippidippi/download-git-repo)，相关语法规范，请[参看](https://gitlab.com/flippidippi/download-git-repo)


#### 如何编写自定义模板

模板仓库必须存在名为template的目录存放模板文件  

模板仓库需要有元数据文件，该文件可以是meta.js或是meta.json。包括以下字段： 

- prompts - 用于收集用户选项数据;

- filters - 用于给定条件进行过滤渲染.

- complete - 用于模板下载完成后的后续操作

##### prompts

一个标准Object对象，键是变量，值是问题对象。其具体形式可参看[inquirer.js](https://github.com/SBoudrias/Inquirer.js/#question)

**示例**  
```
{
  "prompts": {
    "name": {
      "type": "string",
      "required": true,
      "message": "Project name"
    },
    "router":{
      "type": "confirm",
      "message": "Use React Router?"
    }
  }
}
```

##### filters

一个标准Object对象，键是文件路径，值是对应问题变量名。

```
{
  "filters": {
    "router/**/*": "router"
  }
}
```

##### complete function

用于进行在模板下载完成后的后续操作

