import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import {
    linkProfileToFacebook, linkProfileToGoogle, linkProfileToPhone,
    updateDisplayNameRequest, deleteAccountRequest
} from './actions';
import * as selectors from './selectors';
import LinkAccounts from './linkaccounts/LinkAccounts';
import styles from './Profile.module.scss';
import SuccessModal from '../common/modal/SuccessModal';
import materialStyles from '../materialStyles';
import * as appConstants from '../constants';
import TextInput from '../common/TextInput/TextInput';
import StyledButton from '../common/StyledButton/StyledButton';
import * as textInputConstants from '../common/TextInput/constants';
import LoadingDiv from '../common/loadingDiv/LoadingDiv';

const Profile = props => {
    const classes = makeStyles(materialStyles)();
    const isMobile = useMediaQuery(`(max-width:${appConstants.mobileScreenSize}px)`);
    const [newDisplayName, setNewDisplayName] = React.useState('');
    const [isDisplayNameModalOpen, setIsDisplayNameModalOpen] = React.useState(false);

    const toggleDisplayNameModal = React.useCallback(() => {
        setIsDisplayNameModalOpen(!isDisplayNameModalOpen);
    }, [isDisplayNameModalOpen, setIsDisplayNameModalOpen]);

    const updateDisplayName = React.useCallback(() => {
        props.updateDisplayNameRequest(newDisplayName);
        setIsDisplayNameModalOpen(false);
    }, [props, newDisplayName]);

    React.useEffect(() => {
        if (!props.updatingDisplayName) {
            setNewDisplayName('');
        }
    }, [props.updatingDisplayName]);

    const closeModal = () => {
        setNewDisplayName('');
        setIsDisplayNameModalOpen(false);
    };

    const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);

    const [deleteAccountText, setDeleteAccountText] = React.useState('');

    const closeDeleteAccount = () => {
        setIsDeletingAccount(false);
        setDeleteAccountText('');
    };

    const deleteAccount = () => {
        props.deleteAccountRequest();
        setIsDeletingAccount(false);
        setDeleteAccountText('');
    };

    return (
        <>
            <div className={styles.profileWrapper}>
                <Paper
                    elevation={4}
                    className={classNames({
                        [classes.paperNoPadding]: true,
                        [classes.paperTinyWidth]: !isMobile,
                        [classes.maxWidth]: isMobile
                    })}
                >
                    <div className={styles.profileHeader}>
                        <div>
                            <div className={styles.key}>
                                Display Name
                            </div>
                            <div className={styles.displayName}>
                                {props.profile.displayName || 'N/A'}
                            </div>
                        </div>
                        <div className={styles.editIcon}>
                            <EditIcon onClick={toggleDisplayNameModal} />
                        </div>
                    </div>
                </Paper>
                <LinkAccounts
                    isSignedInWithFacebook={props.isSignedInWithFacebook}
                    isSignedInWithGoogle={props.isSignedInWithGoogle}
                    linkProfileToFacebook={props.linkProfileToFacebook}
                    linkProfileToGoogle={props.linkProfileToGoogle}
                />
            </div>
            <div className={styles.deleteButton}>
                <StyledButton text="Delete Account" color="secondary" onClick={() => setIsDeletingAccount(true)} />
            </div>
            <SuccessModal
                backdrop
                closeModal={() => setIsDisplayNameModalOpen(false)}
                isOpen={isDisplayNameModalOpen || props.updatingDisplayName}
                headerMessage="Edit Display Name"
                toggleModal={() => setIsDisplayNameModalOpen(false)}
            >
                <div className={styles.modalWrapper}>
                    <div className={classNames({
                        [styles.smallWidth]: !isMobile
                    })}
                    >
                        <TextInput
                            icon={textInputConstants.textInputIcons.user}
                            iconColor="primary"
                            value={newDisplayName}
                            onChange={setNewDisplayName}
                            label="Edit Display Name"
                        />
                    </div>
                    <div className={styles.confirmButtons}>
                        <LoadingDiv isLoading={props.updatingDisplayName} isBorderRadius>
                            <StyledButton
                                color="primary"
                                onClick={updateDisplayName}
                                text="Confirm"
                                disabled={props.updatingDisplayName || !newDisplayName}
                            />
                            <StyledButton
                                color="secondary"
                                onClick={closeModal}
                                text="Cancel"
                                disabled={props.updatingDisplayName}
                            />
                        </LoadingDiv>
                    </div>
                </div>
            </SuccessModal>

            <SuccessModal
                backdrop
                closeModal={closeDeleteAccount}
                isOpen={isDeletingAccount || props.deletingAccount}
                headerMessage="Delete Account"
                toggleModal={closeDeleteAccount}
            >
                <div className={styles.modalWrapper}>
                    <TextInput
                        icon={textInputConstants.textInputIcons.user}
                        iconColor="primary"
                        value={deleteAccountText}
                        onChange={setDeleteAccountText}
                        label="Type delete to confirm"
                    />
                    <div className={styles.confirmButtons}>
                        <LoadingDiv isLoading={props.deletingAccount} isBorderRadius>
                            <StyledButton
                                color="primary"
                                onClick={deleteAccount}
                                text="Delete"
                                disabled={deleteAccountText.toLowerCase() !== 'delete' || props.deletingAccount}
                            />
                            <StyledButton
                                color="secondary"
                                onClick={closeDeleteAccount}
                                text="Cancel"
                                disabled={props.deletingAccount}
                            />
                        </LoadingDiv>
                    </div>
                </div>
            </SuccessModal>
        </>
    );
};

const mapDispatchToProps = {
    deleteAccountRequest,
    linkProfileToFacebook,
    linkProfileToGoogle,
    linkProfileToPhone,
    updateDisplayNameRequest
};

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    deletingAccount: state.profile.deletingAccount,
    isSignedInWithFacebook: selectors.isSignedIn(state, 'facebook.com'),
    isSignedInWithGoogle: selectors.isSignedIn(state, 'google.com'),
    isSignedInWithPhone: selectors.isSignedIn(state, 'phone'),
    profile: selectors.getProfile(state),
    updatingDisplayName: state.profile.updatingDisplayName
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

export { Profile as ProfileUnconnected };
