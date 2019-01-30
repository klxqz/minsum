<?php

/**
 * @author wa-plugins.ru <support@wa-plugins.ru>
 * @link http://wa-plugins.ru/
 */
class shopMinsumPlugin extends shopPlugin
{

    public static $templates = array(
        'minsum_js' => array(
            'name' => 'minsum.js',
            'tpl_path' => 'plugins/minsum/js/',
            'tpl_name' => 'minsum',
            'tpl_ext' => 'js',
            'public' => true
        ),
    );

    public function saveSettings($settings = array())
    {
        $route_hash = waRequest::post('route_hash');
        $route_settings = waRequest::post('route_settings');

        if ($routes = $this->getSettings('routes')) {
            $settings['routes'] = $routes;
        } else {
            $settings['routes'] = array();
        }
        $settings['routes'][$route_hash] = $route_settings;
        $settings['route_hash'] = $route_hash;
        parent::saveSettings($settings);


        $templates = waRequest::post('templates');
        foreach ($templates as $template_id => $template) {
            $s_template = self::$templates[$template_id];
            if (!empty($template['reset_tpl'])) {
                $tpl_full_path = $s_template['tpl_path'] . $route_hash . '.' . $s_template['tpl_name'] . '.' . $s_template['tpl_ext'];
                $template_path = wa()->getDataPath($tpl_full_path, $s_template['public'], 'shop', true);
                @unlink($template_path);
            } else {
                $tpl_full_path = $s_template['tpl_path'] . $route_hash . '.' . $s_template['tpl_name'] . '.' . $s_template['tpl_ext'];
                $template_path = wa()->getDataPath($tpl_full_path, $s_template['public'], 'shop', true);
                if (!file_exists($template_path)) {
                    $tpl_full_path = $s_template['tpl_path'] . $s_template['tpl_name'] . '.' . $s_template['tpl_ext'];
                    $template_path = wa()->getAppPath($tpl_full_path, 'shop');
                }
                $content = file_get_contents($template_path);
                if (!empty($template['template']) && strcmp(str_replace("\r", "", $template['template']), str_replace("\r", "", $content)) != 0) {
                    $tpl_full_path = $s_template['tpl_path'] . $route_hash . '.' . $s_template['tpl_name'] . '.' . $s_template['tpl_ext'];
                    $template_path = wa()->getDataPath($tpl_full_path, $s_template['public'], 'shop', true);
                    $f = fopen($template_path, 'w');
                    if (!$f) {
                        throw new waException('Не удаётся сохранить шаблон. Проверьте права на запись ' . $template_path);
                    }
                    fwrite($f, $template['template']);
                    fclose($f);
                }
            }
        }
    }

    public function frontendCheckout($param)
    {
        $plugin = wa()->getPlugin('minsum');
        if (!$plugin->getSettings('status')) {
            return false;
        }
        $route_hash = null;
        if (shopMinsumRouteHelper::getRouteSettings(null, 'status')) {
            $route_hash = null;
            $route_settings = shopMinsumRouteHelper::getRouteSettings();
        } elseif (shopMinsumRouteHelper::getRouteSettings(0, 'status')) {
            $route_hash = 0;
            $route_settings = shopMinsumRouteHelper::getRouteSettings(0);
        } else {
            return false;
        }

        $cart = new shopCart();
        $result = shopMinsum::checkOrder();
        if (!$result['result'] && $param['step'] != 'success' && $route_settings['redirect']) {
            $cart_url = wa()->getRouteUrl('shop/frontend/cart');
            wa()->getResponse()->redirect($cart_url);
        }
    }

    public function frontendCart()
    {
        if (!$this->getSettings('status')) {
            return false;
        }
        $route_hash = null;
        if (shopMinsumRouteHelper::getRouteSettings(null, 'status')) {
            $route_hash = null;
            $route_settings = shopMinsumRouteHelper::getRouteSettings();
        } elseif (shopMinsumRouteHelper::getRouteSettings(0, 'status')) {
            $route_hash = 0;
            $route_settings = shopMinsumRouteHelper::getRouteSettings($route_hash);
        } else {
            return false;
        }

        $minsum_js_url = shopMinsumRouteHelper::getRouteTemplateUrl('minsum_js', $route_hash);
        $version = $this->getVersion();

        $init_data = array(
            'url' => wa()->getRouteUrl('shop/frontend/cart', array('plugin' => 'minsum')),
            'checkout_selector' => isset($route_settings['checkout_selector']) ? $route_settings['checkout_selector'] : '',
            'cart_actions' => array('save/', 'add/', 'delete/')

        );

        $ss_version = explode('.', wa('shop')->getVersion());
        if ($ss_version[0] >= 8) {
            $init_data['order_calculate_url'] = wa()->getRouteUrl('shop/frontendOrder', array('action' => 'calculate'));
        }

        if (class_exists('shopOnestepPlugin')) {
            $init_data['onestep_url'] = wa()->getRouteUrl('shop/frontend/onestep');
        }

        $json = json_encode($init_data);
        return <<<HTML
<script type="text/javascript" src="{$minsum_js_url}?v{$version}"></script> 
<script type="text/javascript">
    $(function () {
        $.minsum.init({$json});
    });
</script>
HTML;
    }

}
