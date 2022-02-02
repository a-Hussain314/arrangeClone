//
// Copyright (c) 2020 by ACI Worldwide, Inc.
// All rights reserved.
//
// This software is the confidential and proprietary information
// of ACI Worldwide Inc ("Confidential Information"). You shall
// not disclose such Confidential Information and shall use it
// only in accordance with the terms of the license agreement
// you entered with ACI Worldwide Inc.
//

#import "OPPPaymentParams.h"

/**
 Class to encapsulate all necessary transaction parameters for performing Klarna Payments transaction.
 */
NS_ASSUME_NONNULL_BEGIN
@interface OPPKlarnaInlinePaymentParams : OPPPaymentParams

/**
Creates an object representing a Klarna Payments transaction.

@param checkoutID The checkout ID of the transaction. Must be not `nil` or empty.
@param paymentBrand The payment brand of the transaction.
@param error The error that occurred while validating payment parameters. See code attribute (`OPPErrorCode`) and `NSLocalizedDescription` to identify the reason of failure.
@return Returns an object representing a Klarna Payments transaction.
*/
+ (nullable instancetype)klarnaInlinePaymentParamsWithCheckoutID:(NSString *)checkoutID
                                                    paymentBrand:(NSString *)paymentBrand
                                                           error:(NSError **)error;
@end
NS_ASSUME_NONNULL_END

