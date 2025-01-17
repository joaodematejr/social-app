import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {usePalette} from 'lib/hooks/usePalette'
import {DesktopSearch} from './Search'
import {DesktopFeeds} from './Feeds'
import {Text} from 'view/com/util/text/Text'
import {TextLink} from 'view/com/util/Link'
import {FEEDBACK_FORM_URL, HELP_DESK_URL} from 'lib/constants'
import {s} from 'lib/styles'
import {useWebMediaQueries} from 'lib/hooks/useWebMediaQueries'
import {pluralize} from 'lib/strings/helpers'
import {formatCount} from 'view/com/util/numeric/format'
import {useModalControls} from '#/state/modals'
import {useLingui} from '@lingui/react'
import {msg} from '@lingui/macro'
import {useSession} from '#/state/session'
import {useInviteCodesQuery} from '#/state/queries/invites'

export function DesktopRightNav() {
  const pal = usePalette('default')
  const palError = usePalette('error')
  const {_} = useLingui()
  const {isSandbox, hasSession, currentAccount} = useSession()

  const {isTablet} = useWebMediaQueries()
  if (isTablet) {
    return null
  }

  return (
    <View style={[styles.rightNav, pal.view]}>
      <DesktopSearch />

      {hasSession && (
        <View style={{paddingTop: 18, marginBottom: 18}}>
          <DesktopFeeds />
        </View>
      )}

      <View
        style={[
          styles.message,
          {
            paddingTop: hasSession ? 0 : 18,
          },
        ]}>
        {isSandbox ? (
          <View style={[palError.view, styles.messageLine, s.p10]}>
            <Text type="md" style={[palError.text, s.bold]}>
              SANDBOX. Posts and accounts are not permanent.
            </Text>
          </View>
        ) : undefined}
        <View style={[s.flexRow]}>
          {hasSession && (
            <>
              <TextLink
                type="md"
                style={pal.link}
                href={FEEDBACK_FORM_URL({
                  email: currentAccount!.email,
                  handle: currentAccount!.handle,
                })}
                text={_(msg`Feedback`)}
              />
              <Text type="md" style={pal.textLight}>
                &nbsp;&middot;&nbsp;
              </Text>
            </>
          )}
          <TextLink
            type="md"
            style={pal.link}
            href="https://blueskyweb.xyz/support/privacy-policy"
            text={_(msg`Privacy`)}
          />
          <Text type="md" style={pal.textLight}>
            &nbsp;&middot;&nbsp;
          </Text>
          <TextLink
            type="md"
            style={pal.link}
            href="https://blueskyweb.xyz/support/tos"
            text={_(msg`Terms`)}
          />
          <Text type="md" style={pal.textLight}>
            &nbsp;&middot;&nbsp;
          </Text>
          <TextLink
            type="md"
            style={pal.link}
            href={HELP_DESK_URL}
            text={_(msg`Help`)}
          />
        </View>
      </View>

      {hasSession && <InviteCodes />}
    </View>
  )
}

function InviteCodes() {
  const pal = usePalette('default')
  const {openModal} = useModalControls()
  const {data: invites} = useInviteCodesQuery()
  const invitesAvailable = invites?.available?.length ?? 0

  const onPress = React.useCallback(() => {
    openModal({name: 'invite-codes'})
  }, [openModal])
  return (
    <TouchableOpacity
      style={[styles.inviteCodes, pal.border]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        invitesAvailable === 1
          ? 'Invite codes: 1 available'
          : `Invite codes: ${invitesAvailable} available`
      }
      accessibilityHint="Opens list of invite codes">
      <FontAwesomeIcon
        icon="ticket"
        style={[
          styles.inviteCodesIcon,
          invitesAvailable > 0 ? pal.link : pal.textLight,
        ]}
        size={16}
      />
      <Text
        type="md-medium"
        style={invitesAvailable > 0 ? pal.link : pal.textLight}>
        {formatCount(invitesAvailable)} invite{' '}
        {pluralize(invitesAvailable, 'code')} available
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  rightNav: {
    position: 'absolute',
    top: 20,
    // @ts-ignore web only
    left: 'calc(50vw + 320px)',
    width: 304,
    // @ts-ignore web only
    maxHeight: '90vh',
  },

  message: {
    paddingVertical: 18,
    paddingHorizontal: 10,
  },
  messageLine: {
    marginBottom: 10,
  },

  inviteCodes: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteCodesIcon: {
    marginRight: 6,
  },
})
