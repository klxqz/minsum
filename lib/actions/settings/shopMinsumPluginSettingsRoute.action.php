<?php

class shopMinsumPluginSettingsRouteAction extends waViewAction {

    public function execute() {
        $route_hash = waRequest::get('route_hash');
        $plugin_model = new shopPluginModel();
        $view = wa()->getView();
        $view->assign(array(
            'route_hash' => $route_hash,
            'route_settings' => shopMinsumRouteHelper::getRouteSettings($route_hash),
            'templates' => shopMinsumRouteHelper::getRouteTemplates($route_hash),
            'currency' => wa('shop')->getConfig()->getCurrency(true),
            'currencies' => wa('shop')->getConfig()->getCurrencies(),
        ));
    }

}
