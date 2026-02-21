import { TiArrowLeftThick } from '@acadlix/helpers/icons';
import { PostCreateCoupon, UpdateCouponById } from '@acadlix/requests/admin/AdminCouponRequest';
import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import CouponCodeSection from './sections/CouponCodeSection';
import CouponOptionSection from './sections/CouponOptionSection';

const CouponContent = (props) => {
  const methods = useForm({
    defaultValues: {
      code: props?.coupon?.post_title ?? "",
      post_content: props?.coupon?.post_content ?? "",
      post_author: acadlixOptions?.user_id ?? 0,
      meta: {
        disable_coupon: Boolean(props?.coupon?.rendered_metas?.disable_coupon) ?? 0,
        discount_type: props?.coupon?.rendered_metas?.discount_type ?? "percentage", // flat/percentage
        discount: props?.coupon?.rendered_metas?.discount ?? 0,
        minimum_purchase_amount: props?.coupon?.rendered_metas?.minimum_purchase_amount ?? 0,
        expiry_date: props?.coupon?.rendered_metas?.expiry_date ?? "",
        usage_limit_per_coupon: props?.coupon?.rendered_metas?.usage_limit_per_coupon ?? 0,
        usage_limit_per_user: props?.coupon?.rendered_metas?.usage_limit_per_user ?? 0,
      }
    }
  });

  if (process.env.REACT_APP_MODE === 'development') {
    console.log(methods?.watch());
  }
  const navigate = useNavigate();
  const createMutation = PostCreateCoupon();
  const updateMutation = UpdateCouponById(props?.coupon_id);

  const onSubmit = (data) => {
    if (props?.create) {
      createMutation?.mutate(data, {
        onSuccess: () => {
          navigate("/");
        },
      });
    } else {
      updateMutation?.mutate(data, {
        onSuccess: () => {
          navigate("/");
        },
      });
    }
  };

  return (
    <Box>
      <form onSubmit={methods?.handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={{
            xs: 2,
            sm: 4,
          }}
          sx={{
            padding: {
              xs: 2,
              sm: 2,
            },
          }}
        >
          <Grid size={{ xs: 12, sm: 12 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                startIcon={<TiArrowLeftThick />}
                size="medium"
                sx={{
                  width: "fit-content",
                }}
                LinkComponent={Link}
                to="/"
              >
                {__("Back", "acadlix")}
              </Button>
              <Typography variant="h3">
                {props?.create ? __("Create Coupon", "acadlix") : __("Edit Coupon", "acadlix")}
              </Typography>
            </Box>
          </Grid>

          <CouponCodeSection
            {...methods}
          />

          <CouponOptionSection
            {...methods}
          />

          <Grid size={{ xs: 12, sm: 12 }}>
            <Card>
              <CardContent>
                <Button variant="contained" size="medium" type="submit">
                  {createMutation?.isPending || updateMutation?.isPending ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    __("Save Changes", "acadlix")
                  )}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default CouponContent