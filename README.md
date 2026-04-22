# Hawtio Sample Custom Console

[![Test](https://github.com/hawtio/hawtio-sample-custom-console/actions/workflows/test.yml/badge.svg)](https://github.com/hawtio/hawtio-sample-custom-console/actions/workflows/test.yml)

This sample demonstrates how to create a custom console using [Hawtio v5](https://github.com/hawtio/hawtio) as a WAR file. A custom console is a console application that includes Hawtio's built-in plugins (JMX, Camel, etc.) along with your own custom plugins. It can be deployed to application servers such as Jetty, WildFly, and Tomcat.

## Key components

The key components of this sample are as follows:

| File/Directory | Description |
| -------------- | ----------- |
| [sample-plugin/](./sample-plugin) | The Hawtio v5 custom plugin project written in TypeScript. Since a Hawtio plugin is based on React and [Webpack Module Federation](https://module-federation.github.io/), this project uses Yarn v4 and [Webpack](https://webpack.js.org/) as the build tools. You can use any JS/TS tools for developing a Hawtio plugin so long as they can build a React and Webpack Module Federation application. |
| [webpack.config.cjs](./sample-plugin/webpack.config.cjs) | The React application configuration file. The plugin interface is defined with `ModuleFederationPlugin`. The name `samplePlugin` and the module name `./plugin` at the `exposes` section correspond to the parameters `scope` and `module` set to `HawtioPlugin` in `PluginContextListener.java`. |
| [PluginContextListener.java](./src/main/java/io/hawt/examples/customconsole/PluginContextListener.java) | The only Java code that is required to register the custom Hawtio plugin. To register a plugin, it should instantiate [HawtioPlugin](https://github.com/hawtio/hawtio/blob/hawtio-5.1.0/hawtio-plugin-mbean/src/main/java/io/hawt/web/plugin/HawtioPlugin.java) and invoke its `init()` method at initialisation time. The three key parameters to pass to `HawtioPlugin` are `url`, `scope`, and `module`, which are required by Module Federation. This servlet listener is then configured in `web.xml`. |
| [pom.xml](./pom.xml) | This project uses Maven as the primary tool for building. Here, the `frontend-maven-plugin` is used to trigger the build of `sample-plugin` TypeScript project, then the built output is included as resources for packaging the WAR archive. |

### Branding and styles customisation in a custom console

This example also demonstrates how branding and styles can be customised in a custom console.

The Plugin API `configManager` provides `configure(configurer: (config: Hawtconfig) => void)` method and you can customise the `Hawtconfig` by invoking it from the plugin's `index.ts`.

[console/src/sample-plugin/index.ts](console/src/sample-plugin/index.ts)

```typescript

configManager.configure(config => {
  // Branding & styles
  config.branding = {
    appName: 'Hawtio Sample Custom Console',
    showAppName: true,
    appLogoUrl: '/sample-plugin/branding/Logo-RedHat-A-Reverse-RGB.png',
    css: '/sample-plugin/branding/app.css',
    favicon: '/sample-plugin/branding/favicon.ico',
  }
  // Login page
  config.login = {
    description: 'Login page for Hawtio Sample Custom Console application.',
    links: [
      { url: '#terms', text: 'Terms of use' },
      { url: '#help', text: 'Help' },
      { url: '#privacy', text: 'Privacy policy' },
    ],
  }
  // About modal
  if (!config.about) {
    config.about = {}
  }
  config.about.title = 'Hawtio Sample Custom Console'
  config.about.description = 'About page for Hawtio Sample Custom Console application.'
  config.about.imgSrc = '/sample-plugin/branding/Logo-RedHat-A-Reverse-RGB.png'
  if (!config.about.productInfo) {
    config.about.productInfo = []
  }
  config.about.productInfo.push(
    { name: 'Hawtio Sample Plugin - simple-plugin', value: '1.0.0' },
    { name: 'Hawtio Sample Plugin - custom-tree', value: '1.0.0' },
  )
  // If you want to disable specific plugins, you can specify the paths to disable them.
  //config.disabledRoutes = ['/simple-plugin']
})
```

## How to run

### Build

The following command first builds the `sample-plugin` frontend project and then compiles and packages the main Java project together.

```console
mvn clean install
```

Building the frontend project can take time, so if you build it once and make no changes on the project afterwards, you can speed up the whole build by skipping the frontend part next time.

```console
mvn install -Dskip.yarn
```

### Deploy

Copy the built file `target/sample-plugin.war` to the deployment directory of the application server of your choice.

### Test run

You can quickly run and test the application by using `jetty-maven-plugin` configured in `pom.xml`. It launches an embedded Jetty server and deploys the custom console WAR application.

```console
mvn jetty:run -Dskip.yarn
```

You can access the custom console at: <http://localhost:8080/sample-plugin/>

## Faster plugin development

You could run `mvn install` or `mvn jetty:run` every time to incrementally develop the `sample-plugin` frontend project while checking its behaviour in the browser. But this is not suitable for running the fast development feedback cycle.

As shown below, a faster development cycle can be achieved by directly running the `sample-plugin` frontend project itself in development mode with `yarn start`, while starting the main WAR application on the backend.

### Development

To develop the plugin, firstly launch the main WAR application on the backend:

```console
mvn jetty:run -Dskip.yarn
```

Then start the plugin project in development mode:

```console
cd sample-plugin
yarn start
```

Now you should be able to preview the custom console under development at <http://localhost:3001/hawtio/>. However, since it still hasn't been connected to a backend JVM, you can only test plugins that don't require the JMX MBean tree.

To test plugins that depend on the JMX MBean tree, use Connect plugin <http://localhost:3001/hawtio/connect> to connect to the main WAR application running in the background. The Jolokia endpoint should be <http://localhost:8080/hawtio/jolokia>.

Now you can preview all kinds of plugins on the console under development, and run a faster development cycle by utilising hot reloading provided by Webpack.
