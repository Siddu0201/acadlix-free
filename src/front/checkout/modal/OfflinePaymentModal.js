import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import React from 'react'
import { __ } from '@wordpress/i18n';

const OfflinePaymentModal = ({
	open = false,
	handleClose = null,
	maxWidth = "sm",
	handleOfflinePayment = null,
	isPending = false,
	...props
}) => {
	const defaultSetting = {
		component: "BootstrapDialog",
		props: {
			maxWidth: maxWidth,
			open: open,
			onClose: handleClose,
		},
		children: [
			{
				component: "DialogTitle",
				props: {
					sx: {
						m: 0,
						p: 2,
					},
				},
				value: __("Offline Payment Instructions", "acadlix"),
			},
			{
				component: "IconButton",
				props: {
					onClick: handleClose,
					sx: {
						position: 'absolute',
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
						boxShadow: "none",
					},
				},
				children: [
					{
						component: "IoClose",
						props: {
							style: {
								fontSize: 20
							}
						}
					}
				],
			},
			{
				component: "DialogContent",
				children: [
					{
						component: "Grid",
						props: {
							container: true,
							spacing: 2,
						},
						children: [
							{
								component: "Grid",
								props: {
									size: { xs: 12, sm: 12, lg: 12 },
								},
								children: [
									{
										component: "CustomTypography",
										value: __("Given Instructions for offline payment go here. Please follow the steps to complete your payment.", "acadlix"),
									}
								],
							},
							{
								component: "Grid",
								props: {
									size: { xs: 12, sm: 12, lg: 12 },
								},
								children: [
									{
										component: "RawHTML",
										value: acadlixCheckoutOptions?.offline_data?.acadlix_offline_instructions || '',
									}
								],
							},
							{
								component: "Grid",
								props: {
									size: { xs: 12, sm: 12, lg: 12 },
								},
								children: [
									{
										component: "CustomTypography",
										value: __("Enter Detail", "acadlix"),
									}
								],
							},
							{
								component: "Grid",
								props: {
									size: { xs: 12, sm: 12, lg: 12 },
								},
								children: [
									{
										component: "textarea",
										props: {
											rows: 3,
											name: "offline_user_text",
											style: {
												width: "100%",
											},
											value: props?.watch("offline_user_text") || "",
											onChange: (e) => props?.setValue("offline_user_text", e.target.value, { shouldDirty: true }),
										},
									}
								],
							},
							{
								component: "Grid",
								props: {
									size: { xs: 12, sm: 12, lg: 12 },
								},
								children: [
									{
										component: "CustomTypography",
										value: __("Upload File", "acadlix"),
									}
								],
							},
							{
								component: "Grid",
								props: {
									size: { xs: 12, sm: 12, lg: 12 },
								},
								children: [
									{
										component: "DragDropUpload",
										props: {
											accept: acadlixCheckoutOptions?.offline_data?.acadlix_offline_allowed_mime_types?.map(type => `.${type.extension}`) || "",
											files: props?.watch("offline_upload_file") ? [props?.watch("offline_upload_file")] : [],
											multiple: false,
											sx: {
												width: "100%",
											},
											maxFileSize: acadlixCheckoutOptions?.offline_data?.acadlix_offline_max_upload_file_size * 1024 * 1024, // 5 MB
											buttonLabel: __("Select File", "acadlix"),
											placeholder: __("Drag & drop file here or click to select", "acadlix"),
											onFiles: (files) => {	
												props?.setValue("offline_upload_file", 
													files.length > 0 ? files[0] : null, 
													{ shouldDirty: true }
												);
											},
										},
									}
								],
							},
						]
					}
				]
			},
			{
				component: "DialogActions",
				children: [
					{
						component: "Button",
						props: {
							variant: "contained",
							color: "error",
							onClick: handleClose,
						},
						value: __("Cancel", "acadlix"),
					},
					{
						component: "Button",
						props: {
							variant: "contained",
							onClick: () => handleOfflinePayment && handleOfflinePayment(),
							loading: isPending,
						},
						value: isPending ? __("Processing...", "acadlix") : __("Submit", "acadlix"),
					}
				],
			}
		],
	};

	const offlines = window?.acadlixHooks?.applyFilters(
		'acadlix.front.checkout.offline_payment.modal',
		[defaultSetting],
		{ open, handleClose, maxWidth }
	);

	return (
		<React.Fragment>
			{offlines.map((field, i) => (
				<React.Fragment key={i}>
					<DynamicMUIRenderer
						item={field}
						index={i}
						formProps={{}}
					/>
				</React.Fragment>
			))}
		</React.Fragment>
	)
}

export default OfflinePaymentModal