import { Box, Container, Grid } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import React, { FC, Fragment } from 'react'
import styled, { css } from 'styled-components'

interface IProps {
  title: string
  rightControl?: React.ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

const StyledGrid = styled(Grid)(
  ({ theme }) => css`
    position: absolute;
    top: 0px;
    ${theme.breakpoints.up('sm')} {
      top: 50%;
      transform: translate(0%, -50%);
    }
  `
)

const StyledBox = styled(Box)(
  ({ theme }) =>
    css`
      margin: 25px 0 25px 0;
      padding: 50px 50px 50px 50px;
      background: ${theme.template.body[1]};
    `
)

const StyledContainer = styled(Container)`
  padding: 0;
`

const DefaultPage: FC<IProps> = ({ title, rightControl, maxWidth = 'md', children }) => {
  return (
    <Fragment>
      <StyledGrid container direction="column">
        <StyledContainer maxWidth={maxWidth}>
          <Typography variant="h4" style={{ flex: 1 }}>
            {title}
          </Typography>
          <StyledBox boxShadow={5}>
            <Grid item xs={12} style={{ display: 'flex', flexWrap: 'wrap' }}>
              {rightControl}
            </Grid>
            {children}
          </StyledBox>
          {/* <BottomLogo /> */}
        </StyledContainer>
      </StyledGrid>
    </Fragment>
  )
}

export default DefaultPage
