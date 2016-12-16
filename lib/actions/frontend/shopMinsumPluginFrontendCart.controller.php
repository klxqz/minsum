<?php

/**
 * @author wa-plugins.ru <support@wa-plugins.ru>
 * @link http://wa-plugins.ru/
 */
class shopMinsumPluginFrontendCartController extends waJsonController {

    public function execute() {
        $check = shopMinsum::checkOrder();
        $this->response['check'] = $check;
    }

}
