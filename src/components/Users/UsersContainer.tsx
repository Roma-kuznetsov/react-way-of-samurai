import React from 'react';
import { connect } from 'react-redux';
import { follow, setCurrentPage, unfollow, toggleFollowingProgress, requestUsers } from '../../redux/users-reducer';
import Users from './Users';
import Preloader from "../common/Preloader/Preloader";
import { compose } from "redux";
import {
    getCurrentPage,
    getFollowingInProgress,
    getIsFetching,
    getPageSize,
    getTotalUsersCount, getUsers
} from "../../redux/users-selectors";
import { UsersType } from '../../types/types';
import { AppStateType } from '../../redux/redux-store';

type OwnPropsType = {
    title:string
}
type MapStateToPropsType = {
    currentPage: number
    pageSize: number
    isFetching:boolean
    totalUsersCount:number
    users:Array<UsersType>
    followingInProgress:Array<number>
}
type MapDispatchToPropsType = {
    getUsers:(currentPage:number,pageSize:number) => void
    follow:(userId:number)=> void
    unfollow:(userId:number)=> void
}

type PropsType = OwnPropsType & MapStateToPropsType & MapDispatchToPropsType

class UsersContainer extends React.Component<PropsType> {
    componentDidMount() {
        const { currentPage, pageSize } = this.props;
        this.props.getUsers(currentPage, pageSize);
    }

    onPageChanged = (pageNumber:number) => {
        const { pageSize } = this.props;
        this.props.getUsers(pageNumber, pageSize);
    }

    render() {

        return <>
        <h2>{this.props.title}</h2>
            {this.props.isFetching ? <Preloader /> : null}
            <Users totalUsersCount={this.props.totalUsersCount}
                pageSize={this.props.pageSize}
                currentPage={this.props.currentPage}
                onPageChanged={this.onPageChanged}
                users={this.props.users}
                follow={this.props.follow}
                unfollow={this.props.unfollow}
                followingInProgress={this.props.followingInProgress}
            />
        </>
    }
}

let mapStateToProps = (state:AppStateType):MapStateToPropsType => {
    return {
        users: getUsers(state),
        pageSize: getPageSize(state),
        totalUsersCount: getTotalUsersCount(state),
        currentPage: getCurrentPage(state),
        isFetching: getIsFetching(state),
        followingInProgress: getFollowingInProgress(state)
    }
}


export default compose(
    connect<MapStateToPropsType,MapDispatchToPropsType,OwnPropsType,AppStateType>
    (mapStateToProps, { follow, unfollow, getUsers: requestUsers })
)(UsersContainer)