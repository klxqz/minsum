(function ($) {
    $.minsum = {
        options: {},
        init: function (options) {
            this.options = options;
            if (!this.checkSettings()) {
                return false;
            }
            if (!$('#minsum-cart').length) {
                if (this.options.is_onestep) {
                    $('.onestep-cart .onestep-cart-form').after('<div id="minsum-cart" class="hidden" style="display:none;"></div>');
                } else {
                    $(this.options.checkout_selector).after('<div id="minsum-cart" class="hidden" style="display:none;"></div>');
                }
            }
            this.options.minsum_selector = '#minsum-cart';
            this.initUpdateCart();
            this.initCartTotalChange();

        },
        checkSettings: function () {
            /*Проверка наличия плагина заказ на одной странице*/
            if ($('.onestep-cart').length) {
                this.options.is_onestep = true;
                this.options.cart_total_selector = '.onestep-cart .cart-total';

            } else {
                this.options.is_onestep = false;
                if (!$(this.options.cart_total_selector).length) {
                    console.log('Указан неверный селектор "' + this.options.cart_total_selector + '"');
                    return false;
                }
                if (!$(this.options.checkout_selector).length) {
                    console.log('Указан неверный селектор "' + this.options.checkout_selector + '"');
                    return false;
                }
            }
            return true;
        },
        initCartTotalChange: function () {
            var $cart_total = $(this.options.cart_total_selector);
            var total = '';
            setInterval(function () {
                if (total != $cart_total.html()) {
                    total = $cart_total.html();
                    $(document).trigger('updateCart');
                }
            }, 500);
        },
        disableCheckout: function (loading, message) {
            if ($('#minsum-cart-loading').length) {
                $('#minsum-cart-loading').remove();
            }
            if (message === undefined) {
                message = '';
            }
            if (loading === undefined) {
                loading = false;
            }
            if (this.options.is_onestep) {
                $('.onestep-cart .checkout').hide();
                $(this.options.minsum_selector).text(message);
                if (message) {
                    $(this.options.minsum_selector).removeClass('hidden').addClass('active').show();
                } else {
                    $(this.options.minsum_selector).removeClass('active').addClass('hidden').hide();
                }
                if (loading && !$('#minsum-cart-loading').length) {
                    $('<span id="minsum-cart-loading"><i class="icon16 loading"></i> Пожалуйста, подождите...</span>').insertBefore('.onestep-cart .checkout');
                }
            } else {
                $(this.options.checkout_selector).attr('disabled', true);
                $(this.options.minsum_selector).text(message);
                if (message) {
                    $(this.options.minsum_selector).removeClass('hidden').addClass('active').show();
                } else {
                    $(this.options.minsum_selector).removeClass('active').addClass('hidden').hide();
                }
                if (loading && !$('#minsum-cart-loading').length) {
                    $('<span id="minsum-cart-loading"><i class="icon16 loading"></i> Пожалуйста, подождите...</span>').insertBefore(this.options.checkout_selector);
                }
            }
        },
        enableCheckout: function () {
            if ($('#minsum-cart-loading').length) {
                $('#minsum-cart-loading').remove();
            }
            $(this.options.minsum_selector).text('');
            $(this.options.minsum_selector).removeClass('active').addClass('hidden').hide();
            if (this.options.is_onestep) {
                $('.onestep-cart .checkout').show();
            } else {
                $(this.options.checkout_selector).removeAttr('disabled');
            }
        },
        checkCart: function () {
            var minsum = this;
            this.disableCheckout(true);
            $.ajax({
                type: 'POST',
                url: minsum.options.url,
                dataType: 'json',
                success: function (data, textStatus, jqXHR) {
                    if (data.data.check.result) {
                        minsum.enableCheckout();
                    } else {
                        minsum.disableCheckout(false, data.data.check.message);
                    }
                },
                error: function (jqXHR, errorText) {
                    minsum.enableCheckout();
                }
            });
        },
        initUpdateCart: function () {
            var minsum = this;
            $(document).on('updateCart', function () {
                minsum.checkCart();
            });
        }
    };
})(jQuery);