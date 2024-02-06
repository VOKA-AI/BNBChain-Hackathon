# Greenfield Create React App Template

This project was bootstrapped with [`Create React App`](https://github.com/facebook/create-react-app) and [`greenfield-js-sdk`](https://www.npmjs.com/package/@bnb-chain/greenfield-js-sdk).

> [Preview URL](https://codesandbox.io/p/github/rrr523/greenfield-cra-template/main)


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## 项目描述

项目思路是以用户的address创建bucket，如果第一次使用，需要点击`Join`按钮完成加入（也就是创建bucket）

bucket中保存`glb`模型文件，网站支持上传和删除。

另外结合threejs完成了模型的预览。实现3D模型预览的具体方式是利用API中的[getObjectPreviewUrl](https://docs.bnbchain.org/greenfield-js-sdk/api/object/#getobjectpreviewurl-)接口，获取url，然后利用`useGLTF(url)`获取model。

> ps: 直接用useGLTF获取scene的话，模型需要满足特定结构，否则会报错，参考：https://stackoverflow.com/a/52710540

## 相关文档

### Greenfield

- https://testnet.greenfieldscan.com/
- https://docs.bnbchain.org/greenfield-docs/docs/guide/home
- https://docs.bnbchain.org/greenfield-js-sdk/
- https://github.com/bnb-chain/greenfield-js-sdk
- https://testnet.dcellar.io/

- https://dorahacks.io/hackathon/bnbchain-hackathon/detail
### Threejs
- https://threejs.org/
- https://docs.pmnd.rs/react-three-fiber/getting-started/introduction
