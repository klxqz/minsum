<?php

/**
 * @author wa-plugins.ru <support@wa-plugins.ru>
 * @link http://wa-plugins.ru/
 */
class shopMinsumPluginSettingsAction extends waViewAction {

    public function execute() {
        $this->view->assign(array(
            'templates' => shopMinsumPlugin::$templates,
            'plugin' => wa()->getPlugin('minsum'),
            'route_hashs' => shopMinsumRouteHelper::getRouteHashs(),
        ));
    }

}
