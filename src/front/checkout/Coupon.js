import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import React from 'react'
import { __ } from '@wordpress/i18n';
import { PostApplyCoupon } from '@acadlix/requests/front/FrontCheckoutRequest';
import { formatPrice } from '@acadlix/helpers/util';

const Coupon = (props) => {

  const applyCouponMutation = PostApplyCoupon();
  const handleApplyCoupon = () => {
    const couponCode = props?.watch("coupon_code");
    if (!couponCode) {
      alert(__('Please enter a coupon code.', 'acadlix'));
      return;
    }
    if (props?.watch("total_amount") <= 0) {
      alert(__('Total amount must be greater than zero to apply a coupon.', 'acadlix'));
      return;
    }
    applyCouponMutation.mutate(
      {
        coupon_code: couponCode,
        user_id: props?.watch("user_id") || 0,
        price_after_discount: props?.watch("order_items")?.reduce((acc, item) => acc + item.price_after_discount, 0) || 0,
        currency_symbol: props?.watch("currency_symbol") || '$',
      }, {
      onSuccess: (data) => {
        if (data?.data?.coupon) {
          props?.setValue("coupon", data?.data?.coupon, { shouldDirty: true });
          props?.setValue("coupon_id", data?.data?.coupon.ID, { shouldDirty: true });
          props?.setValue("coupon_amount", data?.data?.coupon?.rendered_metas?.discount, { shouldDirty: true });
          props?.setValue("discount_type", data?.data?.coupon?.rendered_metas?.discount_type, { shouldDirty: true });

          props?.setValue(
            "order_items",
            window?.acadlixHooks?.applyFilters?.("acadlix.front.checkout.set_order_items_with_coupon",
              props?.watch("order_items")?.map((c) => {
                const coupon_amount = data?.data?.coupon?.rendered_metas?.discount || 0;
                const discount_type = data?.data?.coupon?.rendered_metas?.discount_type;
                let price = c?.price || 0;
                let new_discount = 0;

                if (c?.discount > 0) {
                  new_discount = c?.discount;
                  if (c?.additional_fee > 0) {
                    if (discount_type === "percentage") {
                      new_discount += formatPrice((coupon_amount / 100) * c?.additional_fee);
                    } else {
                      const total_additional_fee = props?.watch("order_items")?.reduce((total, item) => total + item.additional_fee, 0) || 0;
                      const proportion = c?.additional_fee / total_additional_fee;
                      new_discount += formatPrice(coupon_amount * proportion);
                    }
                  }
                } else {
                  if (discount_type === "percentage") {
                    new_discount = formatPrice((coupon_amount / 100) * price);
                  } else {
                    const total_price = props?.watch("order_items")?.reduce((total, item) => total + item.price, 0) || 0;
                    const proportion = price / total_price;
                    new_discount = formatPrice(coupon_amount * proportion);
                  }
                }

                if (new_discount > c?.price_after_discount) {
                  new_discount = c?.price_after_discount;
                }

                let price_after_discount = formatPrice(price + (c?.additional_fee || 0) - new_discount);
                let tax = 0;
                let course = props?.watch("cart")?.find((item) => item.course_id === c?.course_id)?.course;
                if (
                  course?.rendered_metas?.tax !== 0 &&
                  course?.rendered_metas?.tax_percent !== 0
                ) {
                  tax = formatPrice(
                    (price_after_discount * course?.rendered_metas?.tax_percent) / 100
                  );
                }
                let price_after_tax = formatPrice(price_after_discount + tax);
                return {
                  ...c,
                  price: price,
                  discount: new_discount + (c?.discount || 0),
                  price_after_discount: price_after_discount,
                  tax: tax,
                  price_after_tax: price_after_tax,
                };
              }),
              {
                props: props,
                coupon: data?.data?.coupon,
              }
            ),
            {
              shouldDirty: true,
            }
          );
        }
      },
      onError: (error) => {
        console.error(error);
        alert(error?.response?.data?.message || __('Failed to apply coupon.', 'acadlix'));
      }
    });
  }

  const handleRemoveCoupon = () => {
    props?.setValue("coupon", null, { shouldDirty: true });
    props?.setValue("coupon_id", null, { shouldDirty: true });
    props?.setValue("coupon_code", "", { shouldDirty: true });
    props?.setValue("coupon_amount", 0, { shouldDirty: true });
    props?.setValue("discount_type", null, { shouldDirty: true });
    props?.setValue(
      "order_items",
      window?.acadlixHooks?.applyFilters?.("acadlix.front.checkout.set_order_items_without_coupon",
        props?.watch("order_items")?.map((c) => {
          let price = c?.price || 0;
          let discount = 0;

          let price_after_discount = formatPrice(price - discount);
          let additional_fee = 0;
          let tax = 0;
          let course = props?.watch("cart")?.find((item) => item.course_id === c?.course_id)?.course;
          if (
            course?.rendered_metas?.tax !== 0 &&
            course?.rendered_metas?.tax_percent !== 0
          ) {
            tax = formatPrice(
              (price_after_discount * course?.rendered_metas?.tax_percent) / 100
            );
          }
          let price_after_tax = formatPrice(price_after_discount + tax);
          return {
            ...c,
            price: price,
            discount: discount,
            price_after_discount: price_after_discount,
            additional_fee: additional_fee,
            tax: tax,
            price_after_tax: price_after_tax,
          };
        }),
        {
          props: props,
        }
      ),
      {
        shouldDirty: true,
      }
    );
  }
  const defaultSetting = {
    component: "Box",
    component_name: "checkout_coupon_box",
    children: [
      {
        component: "Card",
        component_name: "checkout_coupon_card",
        children: [
          {
            component: "CardHeader",
            component_name: "checkout_coupon_card_header",
            props: {
              title: __('Coupon', 'acadlix')
            }
          },
          {
            component: "Divider",
            component_name: "checkout_coupon_divider",
          },
          {
            component: "CardContent",
            component_name: "checkout_coupon_card_content",
            children: [
              {
                component: "Grid",
                component_name: "checkout_coupon_card_content_grid_container",
                props: {
                  container: true,
                  spacing: 2,
                  alignItems: "center",
                },
                children: [
                  {
                    component: "Grid",
                    component_name: "checkout_coupon_code_grid_item",
                    props: {
                      size: {
                        xs: 8,
                        lg: 8,
                      },
                    },
                    children: [
                      {
                        component: "CustomTextField",
                        component_name: "checkout_coupon_code_field",
                        props: {
                          ...props?.register("coupon_code"),
                          name: "coupon_code",
                          label: __('Enter Coupon Code', 'acadlix'),
                          fullWidth: true,
                          size: "small",
                          type: "text",
                          onChange: (e) => {
                            props?.setValue("coupon_code", e.target.value, {
                              shouldDirty: true,
                            });
                          },
                          onKeyDown: (e) => {
                            if (e.key === "Enter") {
                              handleApplyCoupon();
                            }
                          },
                          error: Boolean(
                            props?.formState?.errors?.coupon_code
                          ),
                          helperText: props?.formState?.errors?.coupon_code?.message,
                        }
                      }
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "checkout_coupon_code_button_grid_item",
                    props: {
                      size: {
                        xs: 4,
                        lg: 4,
                      },
                    },
                    children: [
                      {
                        component: "Button",
                        component_name: "checkout_coupon_code_button",
                        props: {
                          fullWidth: true,
                          variant: "contained",
                          onClick: handleApplyCoupon,
                          loading: applyCouponMutation.isPending,
                        },
                        value: __('Apply Coupon', 'acadlix'),
                      }
                    ]
                  },
                  props?.watch("coupon") !== null && props?.watch("coupon")?.post_content &&
                  ({
                    component: "Grid",
                    component_name: "checkout_coupon_description_grid_item",
                    props: {
                      size: {
                        xs: 12,
                        lg: 12,
                      },
                    },
                    children: [
                      {
                        component: "Chip",
                        component_name: "checkout_coupon_description_text",
                        props: {
                          label: props?.watch("coupon")?.post_content || __('No coupon applied.', 'acadlix'),
                          color: "info",
                          onDelete: handleRemoveCoupon,
                        },
                      }
                    ]
                  })
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const coupon = window?.acadlixHooks?.applyFilters?.(
    "acadlix.front.checkout.coupon",
    [defaultSetting],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
    }
  ) ?? [];

  return (
    <>
      {coupon.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            index={i}
            formProps={{
              register: props?.register,
              setValue: props?.setValue,
              watch: props?.watch,
              control: props?.control,
            }}
          />
        </React.Fragment>
      ))}
    </>
  )
}

export default Coupon