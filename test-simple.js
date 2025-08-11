#!/usr/bin/env node

console.log('=== 简单测试 ===');

// 测试基本的命令行参数解析
import { spawn } from 'child_process';

const testHelp = () => {
  return new Promise((resolve) => {
    const child = spawn('node', ['cli.mjs', '--help'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5000
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
    
    child.on('error', (err) => {
      resolve({ code: -1, stdout: '', stderr: err.message });
    });
  });
};

const testVersion = () => {
  return new Promise((resolve) => {
    const child = spawn('node', ['cli.mjs', '--version'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5000
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
    
    child.on('error', (err) => {
      resolve({ code: -1, stdout: '', stderr: err.message });
    });
  });
};

async function runTests() {
  console.log('1. 测试 --help...');
  const helpResult = await testHelp();
  console.log('结果:', {
    code: helpResult.code,
    hasOutput: helpResult.stdout.length > 0,
    stdout: helpResult.stdout.slice(0, 100),
    stderr: helpResult.stderr.slice(0, 100)
  });
  
  console.log('\n2. 测试 --version...');
  const versionResult = await testVersion();
  console.log('结果:', {
    code: versionResult.code,
    hasOutput: versionResult.stdout.length > 0,
    stdout: versionResult.stdout.slice(0, 100),
    stderr: versionResult.stderr.slice(0, 100)
  });
}

runTests().catch(console.error);
