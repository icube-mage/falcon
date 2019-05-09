import React from 'react';
import PropTypes from 'prop-types';
import { Query as ApolloQuery, OperationVariables, QueryProps as ApolloQueryProps, QueryResult } from 'react-apollo';
import { NetworkStatus, ApolloError } from 'apollo-client';
import { Loader } from './Loader';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ApolloFetchMore<TData, TVariables> = QueryResult<TData, TVariables>['fetchMore'];
export type FetchMore<TData, TVariables> = (data: TData, fetchMore: ApolloFetchMore<TData, TVariables>) => any;

export type QueryRenderProps<TData = any> = TData & {
  loading: boolean;
  networkStatus: NetworkStatus;
  fetchMore: (() => any) | undefined;
};

export type QueryProps<TData = any, TVariables = any> = Omit<ApolloQueryProps<TData, TVariables>, 'children'> & {
  children: (result: QueryRenderProps<TData>) => React.ReactNode;
  fetchMore?: FetchMore<TData, TVariables>;
  passLoading?: boolean;
};

export class Query<TData = any, TVariables = OperationVariables> extends React.Component<
  QueryProps<TData, TVariables>
> {
  static propTypes = {
    ...ApolloQuery.propTypes,
    loader: PropTypes.bool
  };

  getErrorCode(error?: ApolloError): string | undefined {
    if (error) {
      const { graphQLErrors } = error;
      if (Array.isArray(graphQLErrors) && graphQLErrors.length > 0) {
        const { extensions = {} } = graphQLErrors[0];
        const { code } = extensions;

        return code;
      }
    }

    return undefined;
  }

  render() {
    const { children, fetchMore, passLoading, ...restProps } = this.props;

    return (
      <ApolloQuery {...restProps}>
        {({ networkStatus, error, data, loading, fetchMore: apolloFetchMore }) => {
          if (error) {
            const errorCode = this.getErrorCode(error);
            // TODO: add passErrors property or check if errorPolicy === 'all' and pass thru render props all extracted/formated errors with errorcodes instead of inline error message
            return (
              <p>
                {`Error!: ${errorCode}`}
                <br /> {`${error}`}
              </p>
            );
          }

          loading = networkStatus === NetworkStatus.loading || (networkStatus !== NetworkStatus.fetchMore && loading);
          if (!passLoading && loading) {
            return <Loader />;
          }

          return children({
            ...data!,
            loading,
            networkStatus,
            fetchMore: fetchMore ? () => fetchMore(data!, apolloFetchMore) : undefined
          });
        }}
      </ApolloQuery>
    );
  }
}

export type PaginationQuery = {
  pagination: PaginationInput;
};

export type PaginationInput = {
  perPage: number;
  page: number;
};

export type Pagination = {
  totalPages: number;
  totalItems: number;
  perPage: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
};
