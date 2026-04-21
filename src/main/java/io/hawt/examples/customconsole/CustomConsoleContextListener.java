package io.hawt.examples.customconsole;

import jakarta.servlet.ServletContextEvent;

import io.hawt.HawtioContextListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CustomConsoleContextListener extends HawtioContextListener {

    private static final Logger LOG = LoggerFactory.getLogger(CustomConsoleContextListener.class);

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        super.contextInitialized(servletContextEvent);
        LOG.info("Initialised {}", this.getClass().getSimpleName());
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        super.contextDestroyed(servletContextEvent);
        LOG.info("Destroyed {}", this.getClass().getSimpleName());
    }
}
