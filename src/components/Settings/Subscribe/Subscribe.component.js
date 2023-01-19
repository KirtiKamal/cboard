import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Alert from '@material-ui/lab/Alert';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Subscribe.messages';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import './Subscribe.css';

import { INCLUDED_FEATURES } from './Subscribe.constants';
import {
  getProductStatus,
  formatDuration,
  formatTitle
} from './Subscribe.helpers';
import { isAndroid } from '../../../cordova-util';
import { CircularProgress } from '@material-ui/core';

import { Link } from 'react-router-dom';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when clicking the subscribe button
   */
  subscribe: PropTypes.func.isRequired,
  /**
   * flag for user
   */
  isLogged: PropTypes.bool.isRequired,
  /**
   * Name of user
   */
  name: PropTypes.string.isRequired,
  /**
   * User email
   */
  email: PropTypes.string.isRequired
};

const defaultProps = {
  name: '',
  email: '',
  location: { country: null, countryCode: null }
};

const Subscribe = ({
  onClose,
  isLogged,
  subscribe,
  name,
  email,
  location: { country, countryCode },
  onSubmitPeople,
  products,
  subscription
}) => {
  const renderIncludedFeatures = () => {
    return INCLUDED_FEATURES.map(feature => {
      return [
        <ListItem key={feature}>
          <ListItemIcon>
            <CheckCircleIcon />
          </ListItemIcon>
          <ListItemText
            primary={<FormattedMessage {...messages[feature]} />}
            secondary={null}
          />
        </ListItem>
      ];
    });
  };
  const renderProducts = () => {
    return products.map(product => {
      //const canPurchase = product.canPurchase();
      return product.offers.map(offer => {
        //const canPurchase = window.CdvPurchase.store.canPurchase(offer.id);
        return [
          <Grid
            key={offer.id}
            item
            xs={12}
            sm={6}
            style={{ padding: '5px', maxWidth: 328 }}
          >
            <Card style={{ minWidth: 275 }} variant="outlined">
              <CardContent>
                <Typography
                  sx={{ fontSize: 19 }}
                  color="secondary"
                  gutterBottom
                >
                  {formatTitle(product.title)}
                </Typography>
                <Typography variant="h3" component="div">
                  {offer.pricingPhases[0].price} /
                  {formatDuration(offer.pricingPhases[0].billingPeriod)}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth={true}
                  color="primary"
                  {...(!isLogged
                    ? { component: Link, to: '/login-signup' }
                    : { onClick: subscribe(product, offer) })}
                  //disabled={!canPurchase}
                >
                  <FormattedMessage {...messages.subscribe} />
                </Button>
                <Typography sx={{ mb: 1.5 }} color="secondary">
                  <br />
                  <br />
                  <FormattedMessage {...messages.includedFeatures} />
                </Typography>
                <List disablePadding style={{ padding: '5px' }}>
                  {renderIncludedFeatures()}
                </List>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ];
      });
    });
  };

  const renderSubscriptionStatus = () => {
    let productStatus = 'proccesing';
    const { isSubscribed, androidSubscriptionState, expiryDate } = subscription;

    if (isAndroid()) {
      //const productStatus = getProductStatus(subscriptions);
      // productStatus = isSubscribed
      //   ? androidSubscriptionState
      //   : getProductStatus();
      productStatus = androidSubscriptionState;
    }

    const alertProps = {
      // owned: 'success',
      // approved: 'warning',
      // initiated: 'warning',
      active: 'success',
      canceled: 'warning',
      in_grace_period: 'warning',
      proccesing: 'info',
      not_subscribed: 'info',

      on_hold: 'warning', //TODO
      paused: 'info', //TODO
      expired: 'warning' //TODO
    };
    console.log(alertProps[productStatus]);

    const expiryDateFormated = expiryDate
      ? new Date(expiryDate).toLocaleString()
      : '';

    return [
      <Alert
        variant="outlined"
        severity={alertProps[productStatus]}
        // color="info"
        className="Subscribe__Alert"
        icon={
          productStatus === 'proccesing' ? <CircularProgress size={20} /> : ''
        }
        action={
          productStatus === 'proccesing' ? (
            <Button color="inherit" size="small">
              <FormattedMessage {...messages.refresh} />
            </Button>
          ) : (
            ''
          )
        }
      >
        <FormattedMessage
          {...messages[productStatus]}
          values={{ e: `${expiryDateFormated}` }}
        />
      </Alert>
    ];
  };

  return (
    <div className="Subscribe">
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.subscribe} />}
        onClose={onClose}
        // fullWidth
      >
        {renderSubscriptionStatus()}

        <div style={{}}>
          <Grid
            container
            spacing={0}
            alignItems="center"
            justifyContent="space-around"
          >
            {renderProducts()}
          </Grid>
        </div>
      </FullScreenDialog>
    </div>
  );
};

Subscribe.propTypes = propTypes;
Subscribe.defaultProps = defaultProps;

export default Subscribe;
