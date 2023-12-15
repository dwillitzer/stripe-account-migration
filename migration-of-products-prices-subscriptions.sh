#!/bin/bash
LOG_DIR="./logs"
LOG_FILE="${LOG_DIR}/history_changelog_$(date +'%F_%T').log"

# Create the logs directory if it doesn't already exist
mkdir -p ${LOG_DIR}

log_and_write() {
    echo "$(date +'%F %T'): $1" | tee -a ${LOG_FILE}
}

# Import environment variables from .env file
export $(egrep -v '^#' .env | xargs)

log_and_write "Start copying products"
yarn start copy-products 'products.csv' $SOURCE_API_KEY $TARGET_API_KEY &&
log_and_write "Finished copying products"

log_and_write "Start copying prices"
yarn start copy-prices 'products.csv' 'prices.csv' $SOURCE_API_KEY $TARGET_API_KEY &&
log_and_write "Finished copying prices"

log_and_write "Start setting default payment method"
yarn start set-default-payment-method $TARGET_API_KEY &&
log_and_write "Finished setting default payment method"

log_and_write "Start copying and cancelling subscriptions"
yarn start copy-subscriptions 'prices.csv' 'subscriptions.csv' true $SOURCE_API_KEY $TARGET_API_KEY &&
log_and_write "Finished copying and cancelling subscriptions"
