/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { connect } from 'react-redux';

import { RootState } from 'Util/Store/Store.type';

import VideoPopup from './VideoPopup.component';
import { VIDEO_POPUP_ID } from './VideoPopup.config';
import { VideoPopupContainerMapDispatchProps, VideoPopupContainerMapStateProps } from './VideoPopup.type';

/** @namespace Component/VideoPopup/Container/mapStateToProps */
export const mapStateToProps = (state: RootState): VideoPopupContainerMapStateProps => ({
    payload: state.PopupReducer.popupPayload[VIDEO_POPUP_ID] || {}
});

/** @namespace Component/VideoPopup/Container/mapDispatchToProps */
export const mapDispatchToProps = (): VideoPopupContainerMapDispatchProps => ({});

export default connect(mapStateToProps, mapDispatchToProps)(VideoPopup);