import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../App.css';

const Header = () => <span>Settings</span>;

const Main = ({
    environment, setEnvironment,
    devClientId, setDevClientId,
    devClientSecret, setDevClientSecret,
    prodClientId, setProdClientId,
    prodClientSecret, setProdClientSecret
}) => {
    return (
        <div className='v-stack-fill'>
            <div className='v-grow-scroll mb-4'>
                <form id="settings">
                    {/* Environment radios */}
                    <div className="form-group row mb-2">
                        <label className="col-sm-2 col-form-label">Environment</label>
                        <div className="col-sm-10">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="environment"
                                    id="envDev"
                                    value="dev"
                                    checked={environment === 'dev'}
                                    onChange={() => setEnvironment('dev')}
                                />
                                <label className="form-check-label" htmlFor="envDev">Dev</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="environment"
                                    id="envProd"
                                    value="prod"
                                    checked={environment === 'prod'}
                                    onChange={() => setEnvironment('prod')}
                                />
                                <label className="form-check-label" htmlFor="envProd">Prod</label>
                            </div>
                        </div>
                    </div>

                    {/* The rest of the fields */}
                    <div className="form-group row mb-2">
                        <label htmlFor="devClientId" className="col-sm-2 col-form-label">Dev Client ID</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                id="devClientId"
                                value={devClientId}
                                onChange={(e) => setDevClientId(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        <label htmlFor="devClientSecret" className="col-sm-2 col-form-label">Dev Client Secret</label>
                        <div className="col-sm-10">
                            <input
                                type="password"
                                className="form-control"
                                id="devClientSecret"
                                value={devClientSecret}
                                onChange={(e) => setDevClientSecret(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        <label htmlFor="prodClientId" className="col-sm-2 col-form-label">Prod Client ID</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                id="prodClientId"
                                value={prodClientId}
                                onChange={(e) => setProdClientId(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        <label htmlFor="prodClientSecret" className="col-sm-2 col-form-label">Prod Client Secret</label>
                        <div className="col-sm-10">
                            <input
                                type="password"
                                className="form-control"
                                id="prodClientSecret"
                                value={prodClientSecret}
                                onChange={(e) => setProdClientSecret(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Footer = ({ onSave }) => {
    const navigate = useNavigate();

    return (
        <div className='d-flex flex-row justify-content-between'>
            <button className='btn btn-secondary' onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" form='settings' className='btn btn-primary' onClick={onSave}>Save</button>
        </div>
    );
};

const Settings = () => {
    const [environment, setEnvironment] = useState('dev'); // default environment
    const [devClientId, setDevClientId] = useState('');
    const [devClientSecret, setDevClientSecret] = useState('');
    const [prodClientId, setProdClientId] = useState('');
    const [prodClientSecret, setProdClientSecret] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('http://localhost:8080/setting');
            const data = await res.json();

            // Populate values from backend
            data.forEach(({ settingKey, settingValue }) => {
                switch (settingKey) {
                    case 'devClientId': setDevClientId(settingValue); break;
                    case 'devClientSecret': setDevClientSecret(settingValue); break;
                    case 'prodClientId': setProdClientId(settingValue); break;
                    case 'prodClientSecret': setProdClientSecret(settingValue); break;
                    case 'environment': setEnvironment(settingValue); break; // optional if you want to save env
                    default: break;
                }
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const updateSettings = async (e) => {
        e.preventDefault();

        // Build payload including environment if you want to save it
        const payload = [
            { settingKey: 'environment', settingValue: environment },
            { settingKey: 'devClientId', settingValue: devClientId },
            { settingKey: 'devClientSecret', settingValue: devClientSecret },
            { settingKey: 'prodClientId', settingValue: prodClientId },
            { settingKey: 'prodClientSecret', settingValue: prodClientSecret },
        ];

        try {
            const res = await fetch('http://localhost:8080/setting/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error(`Failed to save: ${res.status}`);
            navigate('/');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings.');
        }
    };

    return (
        <Layout
            header={<Header />}
            main={<Main
                environment={environment}
                setEnvironment={setEnvironment}
                devClientId={devClientId}
                setDevClientId={setDevClientId}
                devClientSecret={devClientSecret}
                setDevClientSecret={setDevClientSecret}
                prodClientId={prodClientId}
                setProdClientId={setProdClientId}
                prodClientSecret={prodClientSecret}
                setProdClientSecret={setProdClientSecret}
            />}
            footer={<Footer onSave={updateSettings} />}
        />
    );
};

export default Settings;
