English | [简体中文](./README.zh-CN.md)

# mayfly-cli
----
A simple CLI for scaffolding web projects.

## Installation  

```
npm install -g mayfly-cli
```

## Usage 

```
mayfly init <template-name> <project-name>
```
### Example:  

```
mayfly init react my-project
```

## project template

Current available templates include:  

- react&nbsp;-&nbsp;Single page application template based on Webpack + React  

You can view the currently available templates by the following command

```
mayfly list
```

### Custom Templates
If the official template cannot meet your needs, you can customize it based on the official template, use Github and other warehouses for hosting, and use it through mayfly-cli:  

```
mayfly init username/repo my-project
```
Where username/repo is the GitHub repo shorthand for your fork. use [download-git-repo](https://gitlab.com/flippidippi/download-git-repo), for related grammar specifications, please [see](https://gitlab.com/flippidippi/download-git- repo)

#### How to write a custom template

The template repository must exist in a directory named template to store template files

The template repository needs to have a metadata file, which can be meta.js or meta.json. Include the following fields:

- prompts - used to collect user option data;

- filters - used for filter rendering given conditions.

- complete - for subsequent operations after the template download is complete

##### prompts

A standard Object object, the key is a variable, and the value is the problem object. For the specific form, please refer to [inquirer.js](https://github.com/SBoudrias/Inquirer.js/#question)

**Example**
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

A standard Object object, the key is the file path, and the value is the corresponding variable name.

```
{
   "filters": {
     "router/**/*": "router"
   }
}
```

##### complete function

Used for subsequent operations after the template download is complete