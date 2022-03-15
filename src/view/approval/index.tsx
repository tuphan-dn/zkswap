import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Modal, Row, Space, Typography } from 'antd'
import IconSax from 'components/iconsax'

import { AppDispatch, AppState } from 'store'
import { deposit } from 'store/oracle.reducer'
import { Deposit } from 'helper/nizk'
import { useAccount } from 'hooks/useAccount'
import { useMint } from 'hooks/useMint'
import {
  Account,
  initializeAccount,
  mintTo,
  transfer,
} from 'store/ledger.reducer'
import configs from 'configs'

const {
  sol: { reserve },
} = configs

const Approval = () => {
  const {
    oracle: { ra, rb },
    oracle: { treasuryAPublicKey, treasuryBPublicKey },
    wallet: { wallet1, wallet2, lpWallet },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()

  const srcA = useAccount(wallet1.publicKey)
  const srcB = useAccount(wallet2.publicKey)
  const dstLP = useAccount(lpWallet?.publicKey)
  const mintLP = useMint(lpWallet?.mint)

  const visible = !ra || !rb

  const initSwap = useCallback(async () => {
    if (!srcA || !srcB || !dstLP || !mintLP || !lpWallet) return
    // Init treasuries
    const { [treasuryAPublicKey.toBase58()]: treasuryA } = (await dispatch(
      initializeAccount({
        mintPublicKey: srcA.mint,
        accountPublicKey: treasuryAPublicKey,
      }),
    ).unwrap()) as Record<string, Account>
    const { [treasuryBPublicKey.toBase58()]: treasuryB } = (await dispatch(
      initializeAccount({
        mintPublicKey: srcB.mint,
        accountPublicKey: treasuryBPublicKey,
      }),
    ).unwrap()) as Record<string, Account>
    // Create deposit proof
    const depositProof = Deposit.prove(
      reserve,
      reserve,
      srcA,
      srcB,
      dstLP,
      treasuryA.amount.P,
      treasuryB.amount.P,
      mintLP.supply.P,
    )
    // Deposit
    await dispatch(
      deposit({
        srcAPublicKey: srcA.publicKey,
        srcBPublicKey: srcB.publicKey,
        dstLPPublicKey: lpWallet.publicKey,
        depositProof,
        transfer: (args: any) => dispatch(transfer(args)),
        mintTo: (args: any) => dispatch(mintTo(args)),
      }),
    ).unwrap()
  }, [
    dispatch,
    srcA,
    srcB,
    dstLP,
    treasuryAPublicKey,
    treasuryBPublicKey,
    lpWallet,
    mintLP,
  ])

  return (
    <Modal visible={visible} footer={null} closable={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={4}>
            <Space>
              <IconSax variant="Bulk" name="Warning2" />
              <span>For demostration only!</span>
            </Space>
          </Typography.Title>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Typography.Text>
                The prototype is to propose a zero-knowledge Automated Market
                Maker to serve a secure exchange protocol to zero-knowledge SPL
                tokens. This prototype is containing several assumptions and
                weaknesses that need to be resolved before going live.
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Typography.Text>
                If you would like to employ this approach to build your owned zk
                AMM, please examine the protocol carefully with a deep
                understanding of theoretical and practical cryptography.
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Space>
                <Typography.Text>
                  We're available for technical discussion, business
                  collaboration here:{' '}
                  <Typography.Link
                    onClick={() =>
                      window.open('mailto:hello@descartes.network', '_blank')
                    }
                  >
                    hello@descartes.network
                  </Typography.Link>
                  .
                </Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            onClick={initSwap}
            icon={<IconSax variant="Bulk" name="TickCircle" />}
            block
          >
            Understand
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default Approval
