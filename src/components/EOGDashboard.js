import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../store/action';
import { Provider, createClient, useQuery } from 'urql';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Selection from './Selection';
import Chart from './chart';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const fetMetricsQuery = `
{
  getMetrics
}
`;

const fetchData = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input)  {
    metric,
    measurements{
      at,
      value,
      metric,
      unit
    }
  }
}
`;

const getMetrics = state => {
  const { metrics } = state.dashboard;
  return {
    metrics,
  };
};

const getMeasurements = state => {
  const { measurements } = state.dashboard;
  return {
    measurements,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <EOGDashboard />
    </Provider>
  );
};

const EOGDashboard = () => {
  const [selectedMetrics, setSelectedMetrics] = React.useState([]);

  const dispatch = useDispatch();
  const { metrics } = useSelector(getMetrics);
  const { measurements } = useSelector(getMeasurements);

  const onSelectChange = value => {
    var input =
      value && value.length
        ? value.map(s => {
            var dt = new Date();
            dt.setMinutes(dt.getMinutes() - 10);
            return {
              metricName: s,
              after: dt.getTime(),
            };
          })
        : [];
    setSelectedMetrics(input);
  };

  const [fetMetrics] = useQuery({
    query: fetMetricsQuery,
    variables: {},
  });
  const { data, error } = fetMetrics;

  const [result] = useQuery({
    query: fetchData,
    variables: {
      input: selectedMetrics,
    },
  });

  useEffect(() => {
    if (error) {
      dispatch({ type: actions.weatherApiErrorReceived, error: error.message });
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch({ type: actions.METRICS_DATA_RECEIVED, getMetrics });
  }, [dispatch, data, error]);

  useEffect(() => {
    if (result.error) {
      dispatch({ type: actions.weatherApiErrorReceived, error: result.error.message });
      return;
    }
    if (!result.data) return;
    const { getMultipleMeasurements } = result.data;
    dispatch({
      type: actions.MEASUREMENTS_DATA_RECEIVED,
      getMultipleMeasurements,
    });
    // eslint-disable-next-line
  }, [result]);

  return (
    <Card>
      <CardContent>
        <Selection names={metrics} onSelectChange={onSelectChange} />
        <Chart measurements={measurements} />
      </CardContent>
    </Card>
  );
};
